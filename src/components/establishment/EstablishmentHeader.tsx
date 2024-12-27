import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLocationDot } from "@fortawesome/free-solid-svg-icons"
import RedirectLink from "@/components/form/RedirectLink"
import ContentCard from "../layout/ContentCard"
import { Establishment } from "@/app/(vendor)/dashboard/page"

interface Props {
  establishment: Establishment
  showEditButton?: boolean
}

export default function EstablishmentHeader({ establishment, showEditButton = false }: Props) {
  return (
    <ContentCard className="overflow-hidden">
      <div>
        <img
          src={establishment.background_image}
          alt={`${establishment.name} - Background`}
          className="max-h-[150px] w-full object-cover"
        />
        <img
          src={establishment.logo}
          alt={`${establishment.name} - Logo`}
          className="h-[80px] rounded-full mt-[-40px] ml-[10%]"
        />
      </div>
      <h1 className="text-4xl text-[#FF0000] text-center font-bold mt-[-20px]">
        {establishment.name}
      </h1>
      <div className="grid grid-cols-2 p-3">
        <div className="text-center flex items-center justify-center gap-2 col-span-2 md:col-span-1">
          <FontAwesomeIcon icon={faLocationDot} />
          <div>
            <p>
              {establishment.address.street}, {establishment.address.number}
            </p>
            <p>
              {establishment.address.neighborhood}, {establishment.address.city} - {establishment.address.state}
            </p>
            <p>CEP: {establishment.address.zip_code}</p>
          </div>
        </div>
        <div className="hidden md:block col-span-1">
          <p>Descrição:</p>
          <p>
            Um espaço acolhedor com opções de lanches variados, bebidas
            refrescantes e um ambiente perfeito para relaxar ou se reunir com amigos.
          </p>
        </div>
        {showEditButton && (
          <div className="col-span-2 flex justify-end pt-2">
            <RedirectLink href="/">Editar</RedirectLink>
          </div>
        )}
      </div>
    </ContentCard>
  )
}