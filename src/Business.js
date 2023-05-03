import * as React from 'react';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  Rating
} from '@mui/material';

import { getBusinessDetails } from './yelpApi';

function Business(props) {
  const {id} = props;

  const [businesseDetails, setBusinessDetails] = React.useState({
    name: '',
    image_url: '',
    photos: [],
    review_count: '',
    rating: 0
  });

  React.useEffect(() => {
    async function fetchData() {
      const data = await getBusinessDetails(id);
      setBusinessDetails(data);
    }
    fetchData();
  }, []);



  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        title= {businesseDetails.name}
        subheader={<Rating name="read-only" value={businesseDetails.rating} readOnly />}
      />
      <CardMedia
        component='img'
        height="194"
        image={businesseDetails.image_url}
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

export default Business;