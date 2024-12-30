import ContentCard from "@/components/layout/ContentCard";

interface ProductCardProps {
  image: string;
  name: string;
  price: string;
}

export default function ProductCard({ image, name, price }: ProductCardProps) {
  return (
    <ContentCard className="overflow-hidden">
      <img
        src={image}
        alt={`Imagem de um ${name}`}
        className="w-full h-24 object-cover"
      />
      <div className="p-2 flex flex-col justify-between h-24">
        <h1 className="text-lg line-clamp-2">{name}</h1>
        <p className="text-end font-bold">R$ {price}</p>
      </div>
    </ContentCard>
  );
}