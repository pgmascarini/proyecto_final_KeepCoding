import * as yup from "yup";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import useAuth from '../../hooks/useAuth';

import { Alert, Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';

import Loading from "../../components/Loading";

const SignUp = () => {
  const navigate = useNavigate();
  const { authenticate } = useAuth();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const schema = yup.object().shape({
    username: yup.string().min(3, 'too short').max(20, 'to large').matches(/^[A-Za-z]+$/, { message: 'Invalid format.' }).required("required"),
    email: yup.string().email("email_not_valid").required("required"),
    password: yup.string().min(8, "too_short").max(20, 'to large').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, "Must Contain at least 8 Characters and Max 20, One Uppercase, One Lowercase, One Number").required("required"),
    passwordConfirmation: yup.string().oneOf([yup.ref('password'), null]),
  });

  const formSubmit = async (values) => {
    setIsLoading(true);
    const err = await authenticate(values, 'signup');
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
      <h1>Sign up</h1>
      <hr />
      {error && <Alert variant="danger">{error}</Alert>}
      <Formik
        validationSchema={schema}
        onSubmit={formSubmit}
        initialValues={{
          username: '',
          email: '',
          password: '',
          passwordConfirmation: ''
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

              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control type="email" name="email" placeholder="email@email.com" autoComplete="true" value={values.email} onChange={handleChange} onBlur={handleBlur} isValid={touched.email && !errors.email} isInvalid={!!errors.email} />
                <Form.Control.Feedback type="invalid">
                  Proporcione un correo electrónico válido.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control type="password" name="password" maxLength={20} placeholder="********" autoComplete="true" value={values.password} onChange={handleChange} onBlur={handleBlur} isValid={touched.password && !errors.password} isInvalid={!!errors.password} />
                <Form.Control.Feedback type="invalid">
                  La contraseña debe contener como minimo 8 y como maximo 20 caracteres, debe incluir letras maiusculas y minusculas.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="passwordConfirmation">
                <Form.Label>Confirmar contraseña</Form.Label>
                <Form.Control type="password" name="passwordConfirmation" placeholder="********" autoComplete="true" value={values.passwordConfirmation} onChange={handleChange} onBlur={handleBlur} isValid={touched.passwordConfirmation && !errors.passwordConfirmation} isInvalid={!!errors.passwordConfirmation} />
                <Form.Control.Feedback type="invalid">
                  Las contraseñas deben ser iguales.
                </Form.Control.Feedback>
              </Form.Group>
              <Button variant="secondary" type="submit" disabled={!values.username || !values.email || !values.password || !values.passwordConfirmation || !isValid || isSubmitting}>
                Enviar
              </Button>
            </Form>
          )
        }
      </Formik>
    </>
  );
}

export default SignUp;