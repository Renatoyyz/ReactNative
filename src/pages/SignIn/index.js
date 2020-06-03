import React, {useState, useContext} from 'react';
import { Platform, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/auth';

import { Background, Container,Logo, AreaInput, Input, SubmitButtom,SubmitText,Link,LinkText } from './styles'

export default function SignIn() {

  const navigation = useNavigation();

  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const { signIn, loadingAuth } = useContext(AuthContext);

  function handleLogin(){
    signIn(email, password);
  }

 return (
   <Background>
       <Container
       behavior={ Platform.OS === 'ios' ? 'padding' :  '' }
       enabled
       >
         <Logo source={require('../../assets/Logo.png')} />

         <AreaInput>
            <Input
              placeholder="Email"
              autoCorrect={false}
              autoCaptalize="none"
              value={email}
              onChangeText={(texto) => setEmail(texto)}
            />
         </AreaInput>
         <AreaInput>
            <Input
              placeholder="Senha"
              autoCorrect={false}
              autoCaptalize="none"
              value={password}
              onChangeText={(texto) => setPassword(texto)}
              secureTextEntry={true}
            />
         </AreaInput>

         <SubmitButtom onPress={handleLogin}>
           {
             loadingAuth ? (
               <ActivityIndicator size={20} color="#fff" />
             ):
             (
              <SubmitText>Acessar</SubmitText>
             )
           }
           
         </SubmitButtom>

         <Link onPress={ () => navigation.navigate('SignUp')}>
           <LinkText>Criar uma conta!</LinkText>
         </Link>
          
       </Container>
   </Background>
  );
}