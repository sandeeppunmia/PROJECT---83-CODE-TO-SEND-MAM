import React ,{Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import{Card,Header,Icon} from 'react-native-elements';
import firebase from 'firebase';
import db from '../config.js';

export default class RecieverDetailsScreen extends Component{
  constructor(props){
    super(props);
    this.state={
      userId          : firebase.auth().currentUser.email,
      receiverId      : this.props.navigation.getParam('details')["user_id"],
      requestId       : this.props.navigation.getParam('details')["request_id"],
      itemName        : this.props.navigation.getParam('details')["item_name"],
      description     : this.props.navigation.getParam('details')["decription"],
      receiverName    : '',
      receiverContact : '',
      receiverAddress : '',
      receiverRequestDocId : '',
      userName:''
    }
  }

getRecieverDetails(){
  db.collection('users').where('username','==',this.state.receiverId).get()
  .then(snapshot=>{
    snapshot.forEach(doc=>{
      this.setState({
        recieverName    : doc.data().first_name,
        recieverContact : doc.data().mobile_number,
        recieverAddress : doc.data().address,
      })
    })
  });

  db.collection('exchange_requests').where('exchangeId','==',this.state.exchangeId).get()
  .then(snapshot=>{
    snapshot.forEach(doc => {
      this.setState({recieverRequestDocId:doc.id})
   })
})}

updateBarterStatus=()=>{
  db.collection('all_Barters').add({
    item_name           : this.state.itemName,
    exchange_id          : this.state.exchangeId,
    requested_by        : this.state.recieverName,
    donor_id            : this.state.userId,
    request_status      :  "Donor Interested"
  })
}

componentDidMount(){
  this.getRecieverDetails()
}

addNotifications=()=>{
  var message=this.state.userName + "Have shown interest in donating the book"
  db.collection("all_notifications").add({
    "targeted_user_id":this.state.receiverId,
    "donor_id":this.state.userId,
    "request_id":this.state.requestId,
    "item_name":this.state.itemName,
    "date":firebase.firestore.FieldValue.serverTimestamp(),
    "notification_status":"unread",
    "message":message
  })
}

sendNotification=(itemDetails,reuqestStatus)=>{
  var requestId = itemDetails.request_id;
  var donorId = itemDetails.donor_id;
  db.collection("all_donations")
  .where("request_id","==",requestId)
  .where("donor_id","==",donorId)
  .get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      var message = '';
      if(reuqestStatus === "itemSent1"){
        message = this.state.donorName + "sent you item"
      }else{
        message = this.state.donorName + "has shown interest in donating the item"
      }
      db.collection("all_notifications").doc(doc.id).update({
        "message":message,
        "notification_status":"unread",
        "date":firebase.firestore.FieldValue.serverTimestamp()
      })
    })
  })
}

sendItem=(itemDetails)=>{
  if(itemDetails.request_status === "itemSent"){
    var requestStatus = "donor interested"
    db.collection("all_donations").doc(itemDetails.doc_id).update({
      "requested_status":"donor interested"
    })
    this.sendNotification(itemDetails,requestStatus)
  }else{
    var requestStatus = "bookSent"
    db.collection("all_donations").doc(bookDetails.doc_id).update({
      "request_status":"itemSent"
    })
    this.sendNotification(itemDetails,requestStatus)
  }
}

getUserDetails=(userId)=>{
  db.collection('users').where("email_id","==",userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      this.setState({
        userName:doc.data().first_name + '' + doc.data().last_name
      })
    })
  })
}

  render(){
    return(
      <View style={styles.container}>
        <View style={{flex:0.1}}>
          <Header
            leftComponent ={<Icon name='arrow-left' type='feather' color='#696969'  onPress={() => this.props.navigation.goBack()}/>}
            centerComponent={{ text:"Exchange Items", style: { color: '#90A5A9', fontSize:20,fontWeight:"bold", } }}
            backgroundColor = "#eaf8fe"
          />
        </View>
        <View style={{flex:0.3}}>
          <Card
              title={"Item Information"}
              titleStyle= {{fontSize : 20}}
            >
            <Card >
              <Text style={{fontWeight:'bold'}}>Name : {this.state.itemName}</Text>
            </Card>
            <Card>
              <Text style={{fontWeight:'bold'}}>Reason : {this.state.description}</Text>
            </Card>
          </Card>
        </View>
        <View style={{flex:0.3}}>
          <Card
            title={"Reciever Information"}
            titleStyle= {{fontSize : 20}}
            >
            <Card>
              <Text style={{fontWeight:'bold'}}>Name: {this.state.recieverName}</Text>
            </Card>
            <Card>
              <Text style={{fontWeight:'bold'}}>Contact: {this.state.recieverContact}</Text>
            </Card>
            <Card>
              <Text style={{fontWeight:'bold'}}>Address: {this.state.recieverAddress}</Text>
            </Card>
          </Card>
        </View>
        <View style={styles.buttonContainer}>
          {
            this.state.recieverId !== this.state.userId
            ?(
              <TouchableOpacity
                  style={styles.button}
                  onPress={()=>{
                    this.updateBarterStatus()
                    this.addNotifications()
                    this.props.navigation.navigate('MyBartersScreen')
                  }}>
                <Text>I want to Exchange</Text>
              </TouchableOpacity>
            )
            : null
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  buttonContainer : {
    flex:0.3,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:200,
    height:50,
    justifyContent:'center',
    alignItems : 'center',
    borderRadius: 10,
    backgroundColor: 'orange',
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  }
})