type DestinationHeroProps={
    destination:{
        name:string;
        country:string;
        tagline:string;
        description:string;
        rating:number;
        temperature:string;
    }
}

export default function DestinationHero({
    destination,
}:DestinationHeroProps){
    return(
        <section>
            <p>{destination.country}</p>
            <h1>{destination.name}</h1>
            <p>{destination.tagline}</p>
            <p>{destination.description}</p>

            <div>
               <span>⭐ {destination.rating}</span>
               <span>🌤️ {destination.temperature}</span>
            </div>
        </section>
    )
}