import React from 'react';
import {Container,ButtonMenu} from './style';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

export default function Header() {

const navigation = useNavigation();

 return (
   <Container>
       <ButtonMenu onPress={ () => navigation.toggleDrawer() }>
         <Icon name="menu" size={35} color="#fff" />
       </ButtonMenu>
   </Container>
  );
}