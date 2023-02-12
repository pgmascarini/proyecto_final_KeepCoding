import * as yup from "yup";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useAuth from '../../hooks/useAuth';

import { Alert, Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';

import Loading from "../../components/Loading";

const LogIn = () => {
  const navigate = useNavigate();
  const { authenticate } = useAuth();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const schema = yup.object().shape({
    username: yup.string().min(3, 'too short').max(20, 'to large').matches(/^[A-Za-z]+$/, { message: 'Invalid format.' }).required("required"),
    password: yup.string().min(8, "too_short").max(20, 'to large').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, "Must Contain at least 8 Characters and Max 20, One Uppercase, One Lowercase, One Number").required("required")
  });

  const formSubmit = async (values) => {
    setIsLoading(true);
    const err = await authenticate(values, 'login');
    if (!err) {
      setError(null);
      navigate("/");
    } else {
      setError(err);
    }
    setIsLoading(false);
  }

  return (
    <>
      {isLoading && <Loading />}
      <h1>Log in</h1>
      <hr />
      {error && <Alert variant="danger">{error}</Alert>}
      <Formik
        validationSchema={schema}
        onSubmit={formSubmit}
        initialValues={{
          username: '',
          password: '',
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
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Nombre de usuario</Form.Label>
                <Form.Control type="text" name="username" placeholder="username" autoComplete="true" value={values.username} onChange={handleChange} onBlur={handleBlur} isValid={touched.username && !errors.username} isInvalid={!!errors.username} />
                <Form.Control.Feedback type="invalid">
                  Proporcione un nombre de usuario válido (solo letras - min 3 / max 20).
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control type="password" name="password" maxLength={20} placeholder="********" autoComplete="true" value={values.password} onChange={handleChange} onBlur={handleBlur} isValid={touched.password && !errors.password} isInvalid={!!errors.password} />
                <Form.Control.Feedback type="invalid">
                  La contraseña debe contener como minimo 8 y como maximo 20 caracteres, debe incluir letras maiusculas, minusculas y numeros.
                </Form.Control.Feedback>
              </Form.Group>
              <Button variant="secondary" type="submit" disabled={!values.username || !values.password || !isValid || isSubmitting}>
                Enviar
              </Button>
              <Link style={{ float: "right" }} to="/forgot-password">He olvidado mi contraseña</Link>
            </Form>
          )
        }

      </Formik>
    </>
  );
}

export default LogIn;