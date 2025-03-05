import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import RedirectLink from "@/components/form/RedirectLink";
import ContentCard from "../layout/ContentCard";
import LobsterText from "../form/LobsterText";

interface Props {
  className?: string;
  establishment: IEstablishment;
  showEditButton?: boolean;
}

export default function EstablishmentHeader({ establishment, showEditButton = false, className }: Props) {
  return (
    <ContentCard className={`overflow-hidden ${className}`}>
      <div>
        <img
          src={establishment.background_image}
          alt={`${establishment.name} - Background`}
          className="max-h-[150px] w-full object-cover"
        />
        <img
          src={establishment.logo}
          alt={`${establishment.name} - Logo`}
          className="h-[80px] w-[80px] rounded-full mt-[-40px] ml-[10%] border-2 border-white shadow-md"
        />
      </div>

      <LobsterText className="text-3xl md:text-4xl text-primary text-center font-bold mt-[-10px] md:mt-[-20px]">
        {establishment.name}
      </LobsterText>

      <div className="grid grid-cols-1 md:grid-cols-2 p-4 gap-4">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faLocationDot} className="text-2xl text-primary" />
            <h2 className="text-xl font-semibold text-gray-800">Endereço</h2>
          </div>
          <div className="text-center md:text-left text-gray-600">
            <p className="text-sm">
              {establishment.address.street}, {establishment.address.number}
            </p>
            <p className="text-sm">
              {establishment.address.neighborhood}, {establishment.address.city} - {establishment.address.state}
            </p>
            <p className="text-sm">CEP: {establishment.address.zip_code}</p>
            {establishment.address.reference_point && (
              <p className="text-sm mt-1">
                {establishment.address.reference_point}
              </p>
            )}
          </div>
        </div>

        <div className="text-center md:text-left">
          <h2 className="text-xl font-semibold text-gray-800">Descrição</h2>
          <p className="text-gray-600 text-justify">
            Brownies artesanais feitos por Francisco Henrique, estudante de ADS do IFPI. Venda direta no campus do IFPI.
          </p>
        </div>
      </div>

      {showEditButton && (
        <div className="flex justify-end p-3">
          <RedirectLink href="/" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors">
            Editar
          </RedirectLink>
        </div>
      )}
    </ContentCard>
  );
}