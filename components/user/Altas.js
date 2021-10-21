import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Picker, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';

import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'react-native-image-picker';

export const Altas = () => {

    const [selectedValue, setSelectedValue] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [nombre, setNombre] = useState('');
    const [codigo, setCodigo] = useState('');
    const [password, setPassword] = useState('');
    const [imgServerUrl, setImgServerUrl] = useState('');

    const renderFileUrl = () =>{
        if(imageUrl){
            return <Image source={{uri: imageUrl}} style={{ width: 75, height: 75 }}/>;
        }
        else{
            return <Image source={require('../../imgs/user.png')} style={{ width: 75, height: 75 }}/>;
        }
    }

    useEffect(() => {
        uploadImageToServer(imageUrl).then(r => console.log('')).catch(err => console.log(err));
    }, [imageUrl]);

    const accesoFotos = async() =>{
        ImagePicker.launchImageLibrary(
            {
                mediaType: 'photo',
                includeBase64: false,
                maxHeight: 200,
                maxWidth: 200
            },
            response =>{
                const source = response;
                const array = Object.keys(source).map(key =>{
                    return source[key];
                });
                const finalArray = array[0][0];
                if(finalArray){
                    setImageUrl(finalArray.uri);
                }
            }
        )
    }

    const resetForm = () =>{
        setSelectedValue('');
        setNombre('');
        setPassword('');
        setCodigo('');
        setImgServerUrl('');
        setImageUrl('');
    }

    const uploadImageToServer = async (imageUrl = '') => {
        console.log(imageUrl);
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        var reader = new FileReader();
        reader.onload = () => {
        
            var InsertAPI = 'https://prograinterv.000webhostapp.com/upload.php';
            console.log(reader.result);
            var Data={img:reader.result};
            var headers={
                'Accept':'application/json',
                'Content-Type':'application.json'
                }
            fetch(InsertAPI,{
                method:'POST',
                headers:headers,
                body:JSON.stringify(Data),
        }).then((response)=>response.json()).then((response)=>{
            setImgServerUrl("https://prograinterv.000webhostapp.com/"+response);
            })
            .catch(err=>{
            console.log(err);
                
                })
            }
        reader.readAsDataURL(blob);
        }
    const handleSubmit = async() =>{
        const data = new FormData();
        data.append('name', nombre);
        data.append('code', codigo);
        data.append('password', password);
        data.append('uni', selectedValue);
        data.append('image', imgServerUrl);
        const response = await fetch('https://prograinterv.000webhostapp.com/auth.php', {
            method: 'POST',
            body: data
        });
        const body = await response.text();
        console.log(body);
        if(body){
            Alert.alert('Success', body,[{text:'Ok',onPress: ()=> resetForm()}]);
        }
    }
    return (
        <View>
            <ScrollView>
                <Text style={styles.titulo}>Altas</Text>
                <View style={styles.alta}>
                    <Input
                        placeholder='Nombre'
                        leftIcon={
                            <Icon
                            name='user'
                            size={24}
                            color='black'
                            />
                        }
                        value={nombre}
                        onChangeText={v => setNombre(v)}
                    />
                </View>
                <View style={styles.alta}>
                    <Input
                        placeholder='Código'
                        leftIcon={
                            <Icon
                            name='keyboard-o'
                            size={24}
                            color='black'
                            />
                        }
                        value={codigo}
                        onChangeText={v => setCodigo(v)}
                    />
                </View>
                <View style={styles.alta}>
                    <Input
                        placeholder='Password'
                        leftIcon={
                            <Icon
                            name='lock'
                            size={24}
                            color='black'
                            />
                        }
                        secureTextEntry={true}
                        value={password}
                        onChangeText={v => setPassword(v)}
                        
                    />
                </View>
                <View >
                    <Text style={{fontSize:20, marginLeft:20, marginTop:20}}>Campus</Text>
                    <Picker selectedValue={selectedValue} onValueChange={v => setSelectedValue(v)}
                            style={{height:50, width:150, marginLeft:20}}>
                        <Picker.Item label='' value='' enabled={false}/>
                        <Picker.Item label='CUCEI' value='CUCEI'/>
                        <Picker.Item label='CUCS' value='CUCS'/>
                        <Picker.Item label='CUCEA' value='CUCEA'/>
                        <Picker.Item label='CUCSH' value='CUCSH'/>
                        <Picker.Item label='CUTLAJO' value='CUTLAJO'/>
                        <Picker.Item label='CUTONALA' value='CUTONALA'/>
                    </Picker>
                </View>
                <View style={{marginLeft:20, marginTop:20}}>
                    <TouchableOpacity onPress={accesoFotos}>
                        {renderFileUrl()}
                    </TouchableOpacity>
                </View>
                <View style={{marginTop: 20, width:100, marginLeft:150}}>
                    <Button
                        icon={
                            <Icon
                            
                            name="user-plus"
                            size={15}
                            color="white"
                            />
                        }
                        title=" Altas"
                        onPress={handleSubmit}
                        />
                        
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    titulo:{
        fontSize:30,
        textAlign: 'center'
    },
    alta:{
        width:250,
        marginTop:30,
        marginLeft:20
    }
});

