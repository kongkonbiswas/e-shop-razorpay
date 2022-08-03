import { Button } from "react-bootstrap";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "./App.css";
import app from "./firebase.init";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState } from "react";
import InputGroup from 'react-bootstrap/InputGroup';


const auth = getAuth(app)

function App() {
  const manShirt = 67999;
  const womanShirt = 125000;
  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",

    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

  const loadScript = (src) => {
    return new Promise((resovle) => {
      const script = document.createElement("script");
      script.src = src;

      script.onload = () => {
        resovle(true);
      };

      script.onerror = () => {
        resovle(false);
      };

      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async (amount) => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("You are offline... Failed to load Razorpay SDK");
      return;
    }

    const options = {
      key: "rzp_test_1vBEVXTQz3zVEx",
      currency: "INR",
      amount: amount * 100,
      name: "Thank your for purchasing",
      description: "Thanks for purchasing",
      image:
        "https://mern-blog-akky.herokuapp.com/static/media/logo.8c649bfa.png",

      handler: function (response) {
        alert(response.razorpay_payment_id);
        alert("Payment Successfully");
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resistered, setResistered] = useState(false);
  const [validated, setValidated] = useState(false);
  

  const handleEmailBlur = (e) => {
    setEmail(e.target.value);
  }
  const handlePassBlur = (e) => {
    setPassword(e.target.value);
  }
  const handleResisteredChange = (e) => {
    setResistered(e.target.checked);
  }
  const handleFormSubmit = (e) => {
    
    
    if(resistered) {
      signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
      })
      .catch(error => {
        console.error(error);
        setError(error.massage)
      })
    }
    else(
      createUserWithEmailAndPassword(auth, email, password) 
    .then( result => {
      const user = result.user;
      console.log(user)
      setEmail('')
      setPassword('')
    })
    .catch(error => {
      console.error(error);
      setError(error.massage)
    })
    )
    e.preventDefault();
  }
  

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  return (
    <div className="App">
      <Container>
      <Row>
        <Col>
        <h6>{ resistered ? 'Login' : 'Resister'} Form</h6>
        <Form onSubmit={handleFormSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control onBlur={handlePassBlur} type="password" placeholder="Password" required />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check onChange={handleResisteredChange} type="checkbox" label="Already Resistered!" />
      </Form.Group>
      <Button variant="primary" type="submit">
        {resistered ? 'Login' : 'Resistered'}
      </Button>
    </Form>
        </Col>
        <Col>
        <h6>Shipping Information</h6>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Form.Group as={Col} md="4" controlId="validationCustom01">
          <Form.Label>First name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="First name"
            defaultValue="Mark"
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustom02">
          <Form.Label>Last name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Last name"
            defaultValue="Otto"
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="4" controlId="validationCustomUsername">
          <Form.Label>Username</Form.Label>
          <InputGroup hasValidation>
            <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Username"
              aria-describedby="inputGroupPrepend"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please choose a username.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group as={Col} md="6" controlId="validationCustom03">
          <Form.Label>City</Form.Label>
          <Form.Control type="text" placeholder="City" required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid city.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="3" controlId="validationCustom04">
          <Form.Label>State</Form.Label>
          <Form.Control type="text" placeholder="State" required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid state.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} md="3" controlId="validationCustom05">
          <Form.Label>Zip</Form.Label>
          <Form.Control type="text" placeholder="Zip" required />
          <Form.Control.Feedback type="invalid">
            Please provide a valid zip.
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Form.Group className="mb-3">
        <Form.Check
          required
          label="Agree to terms and conditions"
          feedback="You must agree before submitting."
          feedbackType="invalid"
        />
      </Form.Group>
      <Button type="submit">Submit form</Button>
    </Form>
        </Col>
        <Col>
        
      <div className="product">
        <>
        <h6>Your Cart</h6>
          <div className="prod-container">
            <div className="left-container">
              <div className="prod-container-left">
                <img
                  src="https://img.freepik.com/free-photo/white-t-shirt-model-with-jacket_125540-1033.jpg?size=626&ext=jpg&ga=GA1.2.762775606.1659531805"
                  alt="pimage"
                />
              </div>
            </div>

            <div className="prod-container-right">
              <div className="prod-container-info">
                <h6>Boys t-shirt</h6>
              </div>
                <p>{formatter.format(manShirt)}</p>
              </div>
            <Button onClick={() => displayRazorpay(manShirt)} variant="success" size="sm">
              Purshase
            </Button>
          </div>
        </>
      </div>
      <div className="product">
        <>
          <div className="prod-container">
            <div className="left-container">
              <div className="prod-container-left">
                <img
                  src="https://img.freepik.com/free-photo/girl-wearing-grey-blank-t-shirt-standing-white-wall_273609-13680.jpg?w=1480&t=st=1659532088~exp=1659532688~hmac=e562bdf846addb79d2b8dc3bddc434fa7f8fcff6bb03914c8b620b6a571cfa51"
                  alt="t-shirt"
                />
              </div>
            </div>

            <div className="prod-container-right">
              <div className="prod-container-info">
                <h6>Girl's t-shirt</h6>
              </div>
              <p>{formatter.format(womanShirt)}</p>
            </div>
              <Button onClick={() => displayRazorpay(womanShirt)} variant="success" size="sm">
                Purshase
              </Button>
          </div>
        </>
      </div>
        </Col>
        
      </Row>
    </Container>
    </div>
  );
}

export default App;
