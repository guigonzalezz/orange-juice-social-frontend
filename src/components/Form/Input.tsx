import { FormControl, FormErrorMessage, FormLabel, Input as ChakraInput, InputProps as ChakraInputProps } from "@chakra-ui/react"
import FieldError from 'react-hook-form'
import { forwardRef, ForwardRefRenderFunction } from "react";

interface InputProps extends ChakraInputProps {
  name: string;
  label?: string;
  error?: any;// deveria ser FieldError
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = ({ error = null, name, label, ...rest }, ref) => {
  return (
    <FormControl isInvalid={!!error}>
      {!!label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <ChakraInput
        name={name}
        id={name}
        focusBorderColor="orange.500"
        bgColor="myColors.600"
        variant="filled"
        _hover={{
          bgColor: 'myColors.600'
        }}
        size="lg"
        ref={ref}
        {...rest}

      />

      {!!error && (
        <FormErrorMessage>
          {error.message}
        </FormErrorMessage>
      )}
    </FormControl>
  );
}


export const Input = forwardRef(InputBase)