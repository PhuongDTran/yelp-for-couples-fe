import * as React from 'react';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActionArea,
  Typography,
  Rating,
} from '@mui/material';

import './BusinessCard.css';

function normalize(phone) {
  let newPhone = phone.slice(2);
  //normalize string and remove all unnecessary characters
  newPhone = newPhone.replace(/[^\d]/g, "");

  //check if number length equals to 10
  if (newPhone.length == 10) {
    //reformat and return phone number
    return newPhone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
  }

  return phone;
}

function BusinessCard(props) {
  const { businessDetails, onClick } = props;

  const [selected, setSelected] = React.useState(false);

  const handleCardSelect = e => {
    setSelected(!selected);
    onClick(businessDetails.id);
  }

  return (
      <Card id={businessDetails.id} className='business-container' raised={selected} onClick={handleCardSelect}>
        <CardActionArea>
        <CardHeader
          title={businessDetails.name}
          subheader={<Rating name="read-only" precision={0.5} value={businessDetails.rating} readOnly />}
        />
        <CardMedia
          component='img'
          height="194"
          image={businessDetails.image_url}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {`${businessDetails.name} located in ${businessDetails.location.city} come by to enjoy our foor or call ahead at ${normalize(businessDetails.phone)}
           or just stop by our location at ${businessDetails.location.address1}.`}
          </Typography>
        </CardContent>
        </CardActionArea>
      </Card>
  );
}

export default BusinessCard;
