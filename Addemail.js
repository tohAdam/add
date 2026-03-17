import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';

export default function Quiz() {

  const [screen, setScreen] = useState('login');

  const [email, setEmail] = useState('mobile@uc.com');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [search, setSearch] = useState('');

  const [users, setUsers] = useState([
    { id: '1', email: 'mobile@uc.com', password: 'hello123!' }
  ]);

  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // LOGIN
  const handleLogin = () => {

    const foundUser = users.find(
      item =>
        item.email.toLowerCase() === email.toLowerCase() &&
        item.password === password
    );

    if(foundUser){
      setLoginError('');
      setScreen('home');
    } else {
      setLoginError('Invalid Email or Password');
    }
  };

  // SAVE NEW ACCOUNT
  const handleSave = () => {

    if(newEmail === '' || newPassword === '' || confirmPassword === ''){
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if(newPassword !== confirmPassword){
      Alert.alert('Error', 'Password no match');
      return;
    }

    const duplicate = users.find(
      item => item.email.toLowerCase() === newEmail.toLowerCase()
    );

    if(duplicate){
      Alert.alert('Error', 'Email already exist');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      email: newEmail,
      password: newPassword
    };

    setUsers([...users, newUser]);

    setNewEmail('');
    setNewPassword('');
    setConfirmPassword('');
    setScreen('home');
  };

  const filteredUsers = users.filter(item =>
    item.email.toLowerCase().includes(search.toLowerCase())
  );

  return(
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.headerBox}>

        {screen !== 'login' && (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={()=>{
              if(screen === 'add'){
                setScreen('home');
              } else {
                setScreen('login');
              }
            }}
          >
            <Text style={styles.backText}>&lt;</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.headerLabel}>
          Pingay, Adamusa U.
        </Text>

        {screen === 'home' && (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={()=>setScreen('add')}
          >
            <Text style={styles.addText}>ADD</Text>
          </TouchableOpacity>
        )}

      </View>

      {/* LOGIN PAGE */}
      {screen === 'login' && (
        <View style={styles.center}>

          <View style={styles.box}>

            <Text style={styles.title}>Login</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {loginError !== '' && (
              <Text style={styles.error}>{loginError}</Text>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
            >
              <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>

          </View>
        </View>
      )}

      {/* HOME PAGE */}
      {screen === 'home' && (
        <View style={{flex:1, padding:20}}>

          <TextInput
            style={styles.search}
            placeholder="Search..."
            value={search}
            onChangeText={setSearch}
          />

          <FlatList
            data={filteredUsers}
            keyExtractor={(item)=>item.id}
            renderItem={({item})=>(
              <View style={styles.listItem}>
                <Text>{item.email}</Text>
              </View>
            )}
          />

        </View>
      )}

      {/* ADD PAGE */}
      {screen === 'add' && (
        <View style={styles.center}>

          <View style={styles.box}>

            <Text style={styles.title}>Add Account</Text>

            <TextInput
              style={styles.input}
              placeholder="New Email"
              value={newEmail}
              onChangeText={setNewEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>SAVE</Text>
            </TouchableOpacity>

          </View>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({

  container:{ flex:1, backgroundColor:'#F5F5F5' },

  headerBox:{
    backgroundColor:'#0018F5',
    padding:20,
    marginTop:40,
    alignItems:'center'
  },

  headerLabel:{
    color:'#FFF',
    fontSize:22,
    fontWeight:'bold'
  },

  backBtn:{
    position:'absolute',
    left:15,
    top:20
  },

  backText:{
    color:'#FFF',
    fontSize:28,
    fontWeight:'bold'
  },

  addBtn:{
    position:'absolute',
    right:15,
    top:20,
    backgroundColor:'#FFF',
    paddingHorizontal:10,
    paddingVertical:5,
    borderRadius:5
  },

  addText:{ color:'#0018F5', fontWeight:'bold' },

  center:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },

  box:{
    width:'80%',
    backgroundColor:'#FFF',
    padding:20,
    borderRadius:10,
    elevation:5
  },

  title:{
    fontSize:20,
    fontWeight:'bold',
    textAlign:'center',
    marginBottom:20
  },

  input:{
    borderWidth:1,
    borderColor:'#CCC',
    padding:10,
    borderRadius:8,
    marginBottom:15
  },

  button:{
    backgroundColor:'#4A90E2',
    padding:12,
    borderRadius:8,
    alignItems:'center'
  },

  buttonText:{
    color:'#FFF',
    fontWeight:'bold'
  },

  error:{
    color:'red',
    textAlign:'center',
    marginBottom:10
  },

  search:{
    borderWidth:1,
    borderColor:'#CCC',
    padding:10,
    borderRadius:8,
    marginBottom:10,
    backgroundColor:'#FFF'
  },

  listItem:{
    backgroundColor:'#FFF',
    padding:15,
    marginBottom:5,
    borderRadius:6
  }

});
