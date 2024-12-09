import Link from "next/link";

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
        <Link href={`/`}>
            <div className="bg-white rounded-lg overflow-hidden p-4 shadow-[3px_4px_0_0_#FA240F] transform transition duration-300 hover:scale-105">
                <div className="flex items-center gap-4">
                    <img
                        src={establishment.logo}
                        alt={`${establishment.name} logo`}
                        className="w-28 h-28 object-cover rounded-full"
                    />
                    <div>
                        <h2 className="text-lg text-center font-semibold">{establishment.name}</h2>
                        <p className="text-sm text-gray-600">
                            {establishment.address.street}, {establishment.address.number},{" "}
                            {establishment.address.city} - {establishment.address.state}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}
