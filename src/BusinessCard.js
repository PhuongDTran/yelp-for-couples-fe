import * as React from 'react';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  Rating
} from '@mui/material';

function BusinessCard(props) {
  const {businessDetails} = props;

  return (
    <Card className='business unselected' id={businessDetails.id} onClick={()=>{
      const thisElement = document.getElementById(businessDetails.id);
      if (thisElement.classList.contains("unselected")){
        thisElement.classList.add("selected");
        thisElement.classList.remove('unselected');
      } else {
        thisElement.classList.remove("selected");
        thisElement.classList.add('unselected');
      }
      }} sx={{ maxWidth: 345 }}>
      <CardHeader
        title= {businessDetails.name}
        subheader={<Rating name="read-only" precision={0.5} value={businessDetails.rating} readOnly />}
      />
      <CardMedia
        component='img'
        height="194"
        image={businessDetails.image_url}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          This impressive paella is a perfect party dish and a fun meal to cook
          together with your guests. Add 1 cup of frozen peas along with the mussels,
          if you like.
        </Typography>
      </CardContent>
    </Card>
  );
}

export default BusinessCard;
