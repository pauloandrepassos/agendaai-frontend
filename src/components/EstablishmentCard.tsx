import Link from "next/link";
import ContentCard from "./layout/ContentCard";

interface EstablishmentCardProps {
    establishment: {
        id: number;
        name: string;
        logo: string;
        background_image: string;
        address: {
            street: string;
            number: string;
            city: string;
            state: string;
            zip_code: string;
        };
    };
}

export default function EstablishmentCard({ establishment }: EstablishmentCardProps) {
    return (
        <Link href={`/establishment/${establishment.id}`}>
            <ContentCard className="overflow-hidden">
                <div className="flex items-center gap-4">
                    <img
                        src={establishment.logo}
                        alt={`${establishment.name} logo`}
                        className="w-28 h-28 object-cover"
                    />
                    <div>
                        <h2 className="text-lg text-center font-semibold">{establishment.name}</h2>
                        <p className="text-sm text-gray-600">
                            {establishment.address.street}, {establishment.address.number},{" "}
                            {establishment.address.city} - {establishment.address.state}
                        </p>
                    </div>
                </div>
            </ContentCard>
        </Link>
    );
}
