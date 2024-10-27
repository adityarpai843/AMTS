import React, { useEffect, useState } from "react";
import { Card, Col } from "react-bootstrap";
function Signal(props) {
    let variant = {
        red: "danger",
        yellow: "warning",
        green: "success",
        default : "dark"
    }
    let [signalColor,setSignalColor] = useState(variant.default);

    useEffect(() => {
      const ws = new WebSocket(`ws://localhost:8080?location=${props.name}`);
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if(data.signal && data.location === props.name){
          setSignalColor(variant[data.signal]);
        }
      };
      return () => ws.close();
    },
    [props.name]);
  return (
    
    <Col>
    <Card bg={signalColor} text="white" style={{ width: '18rem' }}>
    <Card.Header>{props.name} Signal</Card.Header>
    <Card.Body>
      <Card.Title>{props.name}</Card.Title>
      <Card.Text>
        The signal comes from signald server which is connected to redis
        broker that utilises pub/sub architecture.
      </Card.Text>
    </Card.Body>
  </Card>
  </Col>
  );
}

export default Signal;