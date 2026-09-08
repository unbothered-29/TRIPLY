import React from 'react';
import DestinationCard from './DestinationCard';

const PopularDestinations = () => {
  return (
<section>
  <h2>Popular Destinations</h2>

  <div>
        <DestinationCard
          name="Tokyo"
          country="Japan"
          slug="tokyo"
        />

        <DestinationCard
          name="Rome"
          country="Italy"
          slug="rome"
        />

        <DestinationCard
          name="Goa"
          country="India"
          slug="goa"
        />
  </div>
</section>
  )
}

export default PopularDestinations;