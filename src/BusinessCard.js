import * as React from 'react';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  Rating,
  Paper
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
  const { businessDetails } = props;

  return (
    <Paper className='business-container'>
      <Card className='business unselected' id={businessDetails.id} onClick={() => {
        const thisElement = document.getElementById(businessDetails.id);
        if (thisElement.classList.contains("unselected")) {
          thisElement.classList.add("selected");
          thisElement.classList.remove('unselected');
        } else {
          thisElement.classList.remove("selected");
          thisElement.classList.add('unselected');
        }
      }}>
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
      </Card>
    </Paper>
  );
}

export default BusinessCard;
