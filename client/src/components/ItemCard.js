import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function ItemCard(props) {
    const [cardState, setCardState] = React.useState(props);

    


    return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        alt = {cardState.title}
        height="140"
        image={'https://project1-upload-files-bucket.s3.ap-south-1.amazonaws.com/'+cardState.fileURL}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {cardState.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {cardState.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="medium" onClick={props.onClick}>Update Description</Button>
        {/* <Button size="small">Button2</Button> */}
      </CardActions>
    </Card>
  );
}
