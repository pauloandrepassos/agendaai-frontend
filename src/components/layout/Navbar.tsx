"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAuthenticatedUser } from "@/utils/fetchUser";
import { apiUrl } from "@/config/api";
import { faShoppingBasket } from "@fortawesome/free-solid-svg-icons/faShoppingBasket";
import ContentCard from "./ContentCard";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faFileAlt, faHome, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";

interface ShoppingBasketResponse {
  id: number;
  total_price: string;
  shoppingBasketItems: {
    id: number;
    product: {
      id: number;
      name: string;
      image: string;
      price: string;
    };
    quantity: number;
  }[];
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<"user" | "basket" | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState("0.00");
  const [basketItems, setBasketItems] = useState<ShoppingBasketResponse["shoppingBasketItems"]>([]);
  const [user, setUser] = useState<IUser | null>(null);
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const toggleDropdown = (type: "user" | "basket") => setDropdownOpen((prev) => (prev === type ? null : type));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("selectedDay");
    router.push("/auth/login");
  };

  const fetchShoppingBasket = async () => {
    try {
      const response = await fetch(`${apiUrl}/shopping-basket/items`, {
        headers: { token: `${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Erro ao obter o cesto de compras.");

      const data: ShoppingBasketResponse = await response.json();
      const totalItemsCount = data.shoppingBasketItems.reduce((sum, item) => sum + item.quantity, 0);
      setTotalItems(totalItemsCount);
      setTotalPrice(data.total_price);
      setBasketItems(data.shoppingBasketItems);
    } catch (error) {
      console.error("Erro ao carregar o cesto de compras:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await fetchAuthenticatedUser();
        if (!userData) throw new Error("Usuário não encontrado.");
        setUser(userData);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        localStorage.removeItem("token")
        router.push("/");
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    if (user?.user_type === "client") {
      fetchShoppingBasket();

      const handleBasketUpdated = () => fetchShoppingBasket();
      window.addEventListener("basketUpdated", handleBasketUpdated);

      return () => {
        window.removeEventListener("basketUpdated", handleBasketUpdated);
      };
    }
  }, [user]);

  return (
    <nav className="" style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between p-3">
        <div className="flex items-center">
          <button onClick={toggleMenu} className="text-secondary lg:hidden focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/">
            <img src="/logo-agendaai.png" alt="Logo" className="w-12 h-12" />
          </Link>
        </div>

        <div className="relative flex items-center gap-8">
          {user?.user_type === "client" && (
            <>
              <Link href={`/order`} className="text-secondary hover:text-primary h-10 text-center flex items-center justify-center gap-1">
                <FontAwesomeIcon className="text-2xl" icon={faFileAlt} />
                Pedidos
              </Link>
              <button
                onClick={() => toggleDropdown("basket")}
                className="text-secondary hover:text-primary h-10 text-center flex items-center justify-center gap-1 relative"
              >
                <FontAwesomeIcon icon={faShoppingBasket} className="text-2xl" />
                Cesto
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-semibold px-1 rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>
              {dropdownOpen === "basket" && (
                <ContentCard className="absolute right-0 top-14 w-72 md:w-96 bg-white overflow-hidden z-50 shadow-lg">
                  <div onMouseLeave={() => setDropdownOpen(null)}>
                    <div className="p-4 max-h-64 flex flex-col gap-4 overflow-y-auto">
                      {basketItems.map((item) => (
                        <div key={item.id} className="flex gap-4 items-center">
                          <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded" />
                          <div>
                            <p className="font-semibold">{item.product.name}</p>
                            <p className="text-gray-600">
                              R$ {Number(item.product.price).toFixed(2)} x {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                      {basketItems.length === 0 && <p className="text-gray-500 text-center">Cesto vazio</p>}
                    </div>
                    <Link href="/shopping-basket" className="m-4 block text-center bg-primary text-white py-2 rounded hover:bg-secondary">
                      Ver Cesto
                    </Link>
                  </div>
                </ContentCard>
              )}
            </>
          )}

          <button
            onClick={() => toggleDropdown("user")}
            className="text-white text-2xl w-10 h-10 text-center flex items-center justify-center rounded-full bg-secondary hover:bg-primary focus:outline-none"
          >
            {user?.image ? (
              <img src={user.image} alt="User" className="w-full h-full rounded-full object-cover" />
            ) : (
              <FontAwesomeIcon icon={faUser} />
            )}
          </button>
          {dropdownOpen === "user" && (
            <ContentCard className="absolute right-0 top-14 w-48 bg-white overflow-hidden z-50">
              <div onMouseLeave={() => setDropdownOpen(null)}>
                <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Perfil
                </Link>
                <Link href="/" className="block px-4 py-2 hover:bg-gray-100">
                  <FontAwesomeIcon icon={faBell} className="mr-2" />
                  Notificações
                </Link>
                <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  <FontAwesomeIcon icon={faSignOut} className="mr-2" />
                  Sair
                </button>
              </div>
            </ContentCard>
          )}
        </div>
      </div>
    </nav>
  );
}