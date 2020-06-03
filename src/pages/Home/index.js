import React, {useContext, useState, useEffect} from 'react';
import { Alert, TouchableOpacity, Platform } from 'react-native';
import firebase from '../../services/firebaseConnection';
import { Background, Container, Nome, Saldo, Title, List, Area } from './style'; 
import { format, isPast } from 'date-fns';

import { AuthContext } from '../../contexts/auth';
import Header from '../../components/Header';
import HistoricoList from '../../components/HistoricoList';

import Icon from 'react-native-vector-icons/MaterialIcons';
import DatePicker from '../../components/DatePicker';

export default function Home() {

const [historico, setHistorico] = useState([]);
const [saldo, setSaldo] = useState(0);

const { user } = useContext(AuthContext); 
const uid = user && user.uid;

const [newDate, setNewDate] = useState(new Date());
const [show, setShow] = useState(false);

useEffect( () => {//useEffect

  async function loadList(){//loadList

    await firebase.database().ref('users').child(uid).on('value', (snapshot)=>{
        setSaldo(snapshot.val().saldo);
    });

    await firebase.database().ref('historico')
    .child(uid)
    .orderByChild('data').equalTo(format(newDate, 'dd/MM/yy' ))
    .limitToLast(10).on('value', (snapshot)=>{
      setHistorico([]);

      snapshot.forEach( (childItem) => {
          let list ={
            key: childItem.key,
            tipo: childItem.val().tipo,
            valor: childItem.val().valor,
            date: childItem.val().data
          };

          setHistorico(oldArray => [...oldArray, list].reverse());

      } );

    })

  }//loadList

  loadList();

}, [newDate] );//useEffect

function handleDelete(data){//handleDelete

  if( isPast(new Date(data.data)) ){
    //se a data do registro já passou
    alert('Você não pode excluir um registro antigo!');
    return;
  }

  Alert.alert(
    'Cuidado.. Atenção!',
    `Você deseja excluir ${data.tipo} - Valor: ${data.valor}`,
    [
      {
        text: 'Cancelar',
        style: 'cancel'
      },
      {
        text: 'Continuar',
        onPress: () => handleDeleteSuccess(data)
      }
    ]
  )

}//handleDelete

async function handleDeleteSuccess(data){//handleDeleteSuccess

    await firebase.database().ref('historico')
    .child(uid).child(data.key).remove()
    .then( async () => {
      let saldoAtual = saldo;
      data.tipo === 'despesa' ? saldoAtual += parseFloat(data.valor) : saldoAtual -= parseFloat(data.valor); 
      await firebase.database().ref('users').child(uid)
      .child('saldo').set(saldoAtual);
    } )
    .catch( (error) => {
      console.log(error);
    } )

}//handleDeleteSuccess

function handleShowPicker(){//handleShowPicker
    setShow(true);
}//handleShowPicker

function handleClose(){//handleClose
    setShow(false);
}//handleClose

const onChange = (date) => {//onChange
    setShow(Platform.OS === 'ios');
    setNewDate(date);
    console.log(date);
}//onChange

 return (
    <Background>
      <Header/>
      <Container>
        <Nome>{user && user.nome}</Nome>
        <Saldo>R$ {saldo.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}</Saldo>
      </Container>

      <Area>
         <TouchableOpacity onPress={handleShowPicker}>
            <Icon name="event" size={30} color="#fff" />
         </TouchableOpacity>
         <Title>Últimas movimentações.</Title>
      </Area>

      <List
        showsVerticalScrollIndicator={false}
        data={historico}
        keyExtrator={ item => item.key }
        renderItem={ ({item}) => ( <HistoricoList data={item} deleteItem={handleDelete} /> ) }
      />

      { show && (
        <DatePicker
          onClose={handleClose}
          date={newDate}
          onChange={onChange}
        />
      ) }

    </Background>
  );
}