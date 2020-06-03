import React, { useState, createContext, useEffect } from 'react';
import firebase from '../services/firebaseConnection';
import AsyncStorage from '@react-native-community/async-storage';

export const AuthContext = createContext({});

function AuthProvider( { children } ){//AuthProvider

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingAuth,setLoadingAuth]  = useState(false);

    useEffect( () => {
        async function loadStorage(){
            const storageUser = await AsyncStorage.getItem('Auth_user');

            if(storageUser){
                setUser(JSON.parse(storageUser));
                setLoading(false);
            }
            setLoading(false);
        }

        loadStorage();
    }, [] );

    //Funcao para logar usuario
    async function signIn(email, password){//signIn
        setLoadingAuth(true);
        await firebase.auth().signInWithEmailAndPassword(email, password)
        .then( async (value)=>{
            let uid = value.user.uid;
            await firebase.database().ref('users').child(uid).once('value')
            .then((snapshot)=>{
                let data = {
                    uid: uid,
                    nome: snapshot.val().nome,
                    email: value.user.email,
                };

                setUser(data);
                storageUser(data);
                setLoadingAuth(false);
            })
        })
        .catch((error)=>{
            alert(error.code);
            setLoadingAuth(false);
        })

    }//signIn

    //Cadastrar usuario
    async function signUp(email, password, nome){//signUp
        setLoadingAuth(true);
        await firebase.auth().createUserWithEmailAndPassword(email, password)
        .then( async (value) => {//then
            let uid = value.user.uid;
            await firebase.database().ref('users').child(uid).set({//set
                saldo: 0,
                nome: nome

            })//set
            .then(()=>{
                let data = {
                    uid: uid,
                    nome: nome,
                    email: value.user.email
                };
                setUser(data);
                storageUser(data);
                setLoadingAuth(false);
            })
        } )//then
        .catch((error)=>{
            alert(error.code);
            setLoadingAuth(false);
        })

    }//signUp

    async function storageUser(data){//storageUser

        await AsyncStorage.setItem('Auth_user', JSON.stringify(data));

    }//storageUser

    async function signOut(){//signOut

        await firebase.auth().signOut();
        await AsyncStorage.clear()
        .then(()=>{
            setUser(null);
        })

    }//signOut

    return(//return

        <AuthContext.Provider value={ { signed: !!user, user, loading,loadingAuth, signUp, signIn, signOut } } >
            {children}
        </AuthContext.Provider>

    );//return

}//AuthProvider

export default AuthProvider;