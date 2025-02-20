import {PasswordInput} from "@/components/ui/password-input.tsx";
import {Button, Field, Flex, Input, Stack} from "@chakra-ui/react"

function App () {
    return (
        <Flex className={"justify-center items-center h-screen"}>
            <Stack gap="8" className={"justify-center items-center m-auto w-96"}>
                <Field.Root orientation="horizontal">
                    <Field.Label>Name</Field.Label>
                    <Input placeholder="John Doe"/>
                </Field.Root>

                <Field.Root orientation="horizontal">
                    <Field.Label>Password</Field.Label>
                    <PasswordInput/>
                </Field.Root>

                <Field.Root orientation="horizontal">
                    <Button className={"m-auto"} colorScheme="blue">Submit</Button>
                </Field.Root>
            </Stack>
        </Flex>
    )
}

export default App;
