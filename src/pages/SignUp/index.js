import React, {useState, useContext} from 'react';
import { Platform,ActivityIndicator } from 'react-native';

import { AuthContext } from '../../contexts/auth';

import { Background, Container,Logo, AreaInput, Input, SubmitButtom,SubmitText } from '../SignIn/styles'

export default function SignIn() {

  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ nome, setNome ] = useState('');

  const { signUp, loadingAuth } = useContext(AuthContext);

  function handleSignUp(){//handleSignUp
    signUp(email, password, nome );
  }//handleSignUp

 return (
   <Background>
       <Container
       behavior={ Platform.OS === 'ios' ? 'padding' :  '' }
       enabled
       >

         <AreaInput>
            <Input
              placeholder="Nome"
              autoCorrect={false}
              autoCaptalize="none"
              value={nome}
              onChangeText={(texto) => setNome(texto)}
            />
         </AreaInput>

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

         <SubmitButtom onPress={handleSignUp} >
           {
             loadingAuth ? (
               <ActivityIndicator size={20} color="#fff" />
             ):
             (
              <SubmitText>Cadastrar</SubmitText>
             )
           }
         </SubmitButtom>
          
       </Container>
   </Background>
  );
}