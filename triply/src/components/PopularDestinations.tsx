import DestinationCard from './DestinationCard';

const destinations = [
  {
    name: "Tokyo",
    country: "Japan",
    slug: "tokyo",
  },
  {
    name: "Rome",
    country: "Italy",
    slug: "rome",
  },
  {
    name: "Goa",
    country: "India",
    slug: "goa",
  },
];

export default function PopularDestinations () {

  return (
<section>
  <h2>Popular Destinations</h2>

<div>
  {destinations.map((destination)=>(
    <DestinationCard 
      key={destination.slug}
      // name={destination.name} 
      // country={destination.country}
      // slug={destination.slug}
      {...destination}     //spread operator
    />
  ))}
</div>
</section>
  )
}
