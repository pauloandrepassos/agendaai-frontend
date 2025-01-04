interface MenuItem {
    id: number;
    name: string;
    image: string;
    price: string;
    category: string;
  }
  
  interface MenuDay {
    id: number;
    establishment_id: number;
    day: string;
    menuItems: MenuItem[];
  }