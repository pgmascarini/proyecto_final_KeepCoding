import * as yup from "yup";
import { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";

import useAuth from '../../hooks/useAuth';

import { Alert, Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';

import Loading from "../../components/Loading";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { resetPasswordCode } = useParams();
  const { resetPassword } = useAuth();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const schema = yup.object().shape({
    password: yup.string().min(8, "too_short").max(20, 'to large').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, "Must Contain at least 8 Characters and Max 20, One Uppercase, One Lowercase, One Number").required("required"),
    passwordConfirmation: yup.string().oneOf([yup.ref('password'), null]),
  });

  const formSubmit = async (values) => {
    setIsLoading(true);
    const err = await resetPassword(values, resetPasswordCode);
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
      <h1>Resetear contraseña</h1>
      <hr />
      {error && <Alert variant="danger">{error}</Alert>}
      <Formik
        validationSchema={schema}
        onSubmit={formSubmit}
        initialValues={{
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
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control type="password" name="password" maxLength={20} placeholder="********" autoComplete="true" value={values.password} onChange={handleChange} onBlur={handleBlur} isValid={touched.password && !errors.password} isInvalid={!!errors.password} />
                <Form.Control.Feedback type="invalid">
                  La contraseña debe contener como minimo 8 y como maximo 20 caracteres, debe incluir letras maiusculas, minusculas y numeros.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="passwordConfirmation">
                <Form.Label>Confirmar contraseña</Form.Label>
                <Form.Control type="password" name="passwordConfirmation" placeholder="********" autoComplete="true" value={values.passwordConfirmation} onChange={handleChange} onBlur={handleBlur} isValid={touched.passwordConfirmation && !errors.passwordConfirmation} isInvalid={!!errors.passwordConfirmation} />
                <Form.Control.Feedback type="invalid">
                  Las contraseñas deben ser iguales.
                </Form.Control.Feedback>
              </Form.Group>
              <Button variant="secondary" type="submit" disabled={!values.password || !values.passwordConfirmation || !isValid || isSubmitting}>
                Enviar
              </Button>
            </Form>
          )
        }
      </Formik>
    </>
  );
}

export default ResetPassword;