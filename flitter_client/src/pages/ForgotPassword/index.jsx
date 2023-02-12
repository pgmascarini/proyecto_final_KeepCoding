import * as yup from "yup";
import { useState } from "react";

import useAuth from '../../hooks/useAuth';

import { Alert, Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';

import Loading from "../../components/Loading";

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const schema = yup.object().shape({
    email: yup.string().email("email_not_valid").required("required")
  });

  const formSubmit = async (values) => {
    setIsLoading(true);
    const response = await forgotPassword(values);
    setMessage(response);
    setIsLoading(false);
  }

  return (
    <>
      {isLoading && <Loading />}
      <h1>Recuperar contraseña</h1>
      <hr />
      {message && <Alert variant={message.type}>{message.description}</Alert>}
      <Formik
        validationSchema={schema}
        onSubmit={formSubmit}
        initialValues={{
          email: '',
        }}
      >
        {
          ({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            isValid,
            errors,
            isSubmitting,
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control type="email" name="email" placeholder="email@email.com" autoComplete="true" value={values.email} onChange={handleChange} onBlur={handleBlur} isValid={touched.email && !errors.email} isInvalid={!!errors.email} disabled={message && message.type === "success"} />
                <Form.Control.Feedback type="invalid">
                  Proporcione un correo electrónico válido.
                </Form.Control.Feedback>
              </Form.Group>
              <Button variant="secondary" type="submit" disabled={!values.email || !isValid || isSubmitting || (message && message.type === "success")}>
                Enviar correo electrónico
              </Button>
            </Form>
          )
        }

      </Formik>
    </>
  );
}

export default ForgotPassword;