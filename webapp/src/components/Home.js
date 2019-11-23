import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { Button, Row, Col } from 'react-materialize';
import { QRCode } from "react-qr-svg";

class Home extends Component {

  constructor(props){
    super(props);
  }

  render() {
    console.log(this.props.globals.qr);
    return (
      <div>
        <Row>
          <Col s={4}>
            <Button
              onClick={ () => this.props.sendTokens({from:'a',to:'b',amount:1,tokenType:'default'}) }
            >
              Enviar de A -> B 1
            </Button >
            <Button
              onClick={ () => this.props.sendTokens({from:'b',to:'a',amount:1,tokenType:'default'}) }
            >
              Enviar de B -> A 1
            </Button >
            <Button
              onClick={ () => this.props.viewBalance({user:'a'}) }
            >
              Balance de A
            </Button >
            <Button
              onClick={ () => this.props.viewBalance({user:'b'}) }
            >
              Balance de B
            </Button >
            <Button
              onClick={ () => this.props.viewBalance({user:'c'}) }
            >
              Balance de C (machine)
            </Button >
            <Button
              onClick={ () => this.props.getFromFaucet({user:'a'}) }
            >
              Dinero de Faucet para A
            </Button >
            <Button
              onClick={ () => this.props.createAccunts({}) }
            >
              Create Accunts (A and B y Machine)
            </Button >
            <Button
              onClick={ () => this.props.createToken({user:'a'}) }
            >
              Crear token para A
            </Button >
            <Button
              onClick={ () => this.props.sendTokens({from:'a',to:'b',amount:1,tokenType:'/9ennxETYQTpvf5CWJZDRcNELmCZc8GjpcVLd27tJ2h7b3xqLQa9/UAI01'}) }
            >
              Enviar de A -> B 1 CUSTOM
            </Button >
            <Button
              onClick={ () => this.props.sendTokens({from:'b',to:'a',amount:1,tokenType:'/9ennxETYQTpvf5CWJZDRcNELmCZc8GjpcVLd27tJ2h7b3xqLQa9/UAI01'}) }
            >
              Enviar de B -> A 1 CUSTOM
            </Button >
          </Col>
          <Col s={4}>
            <Button
              onClick={ () => this.props.testGenerateInvoice({}) }
              style={{backgroundColor: 'green'}}
            >
              Ver Invoice
            </Button >
            <Button
              onClick={ () => this.props.testHacerPago({from:'a'}) }
              style={{backgroundColor: 'green'}}
            >
              Enviar A -> Maquina
            </Button >
            <Button
              onClick={ () => this.props.testShowMyAddToMachine({user:'a'}) }
              style={{backgroundColor: 'green'}}
            >
              Mostrar mi qr a maquina
            </Button >
          </Col>
          <Col s={4}>
            <QRCode
                bgColor="#FFFFFF"
                fgColor="#000000"
                level="Q"
                style={{ width: 256 }}
                value={this.props.globals.qr}
            />
          </Col>
        </Row>
      </div>
    )
  }
};

function mapStateToProps(state){
  return {
    globals: state.globals
  };
};


export default connect(mapStateToProps,actions)(Home);
