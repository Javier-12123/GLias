import {
  FormControl,
  FormLabel,
  Text,
} from "@chakra-ui/react";

interface IViewText {
  form_label: string;
  id_form: string;
  children?: React.ReactNode;
}

const ViewText = (props: IViewText) => {
  return (
    <FormControl paddingTop={15}>
      <FormLabel htmlFor={props.id_form}>{props.form_label}</FormLabel>
      <Text
        id={props.id_form}
        border={"1px"}
        borderColor={"twitter.900"}
        borderStyle={"solid"}
        borderRadius={"5px"}
        height={10}
        bgColor={"gray.100"}
        transitionDuration={"1s"}
        _hover={{
          bgColor: "facebook.900",
          transitionDuration: "1s",
        }}
      >
        {props.children}
      </Text>
    </FormControl>
  );
};

export default ViewText;
