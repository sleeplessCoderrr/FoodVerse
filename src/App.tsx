import { 
  Flex,
  Field,
  Input
 } from "@chakra-ui/react";

function App(){
  return(
    <Flex className="">
      <Field.Root>
          <Field.Label>
            <Field.RequiredIndicator />
          </Field.Label>

          <Input/>
      </Field.Root>
    </Flex>
  )
}

export default App;