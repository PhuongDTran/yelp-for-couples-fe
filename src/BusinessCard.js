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

function BusinessCard(props) {
  const { businessDetails, selected, onClick } = props;

  const handleCardSelect = e => {
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
            {`Location: ${businessDetails.location.display_address}`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {`Phone number: ${businessDetails.display_phone}`}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default BusinessCard;
