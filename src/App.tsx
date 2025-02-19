import { invoke } from "@tauri-apps/api/core";
import { Flex, Input, Button, Stack, Box } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useState } from "react";


import "./App.css";

interface LoginRequest {
  email: string
  password: string
}

function useLoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>();

  const [loginError, setLoginError] = useState<string | null>(null);

  const onSubmit = handleSubmit((data: LoginRequest) => {
    const respone = {
      username : data.email, 
      password : data.password
    }
  });

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting,
    loginError
  };
}

function App() {

  const {register, handleSubmit, onSubmit, errors, isSubmitting, loginError} = useLoginForm();

  return (
    <Flex className="justify-center items-center h-screen ">
      <Box as="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="4" align="flex-start" maxW="sm">
    
          <Field label="Email">
            <Input 
              color="teal.400"
              type="email"
              placeContent="email@mail.com"
              _placeholder={{ color: "teal.400" }}
            />
          </Field>

          <Field label="Password">
            <Input 
              type="password"
            />
          </Field>

          <Button type="submit">Submit</Button>

        </Stack>
      </Box>
    </Flex>
  )
}

export default App;
