// styles.js


import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View, Alert,
  Image, Dimensions, z
} from 'react-native';
import colors from './color';

const { width, height } = Dimensions.get('window');

export const commonStyles = StyleSheet.create({

  // gif: {
  //   width: 40,
  //   height: 40,
  // },

  maincontainer: {
    backgroundColor: colors.bgblack,
    flex: 1,
  },

  // for logo and backbutton container
  backbuttontopcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  // for backbutton container
  backbuttoncontainer: {

  },

  Dashboardcontainer2: {

    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bgblack,
    paddingTop: height * .05,
    paddingBottom: height * .06,
    padding: 2,
  },


  Dashboardcontainer: {
    position: 'relative',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgblack,
    paddingTop: height * 0.05,
    paddingBottom: height * 0.05,
    padding: 2,
  },

  Dashboardcontainer3: {
    position: 'relative',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgblack,
    paddingTop: height * 0.001,
    paddingBottom: height * 0.001,
  },
  navbarcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgblack,
    paddingTop: height * 0.001,
    paddingBottom: height * 0.001,
  },


  footer1: {
    backgroundColor: colors.footerbg,
    padding: 1,
    position: 'absolute',
    // bottom:0,
    width: width,
    zIndex: 999
  },

  footer2: {
    backgroundColor: colors.footerbg,
    padding: 10,
    bottom: 0,
    width: width,
    zIndex: 999
  },



  topcontain: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  notficationimg: {
    position: 'relative',
    // left: width * 0.07,
    width: width * .06,
    height: height * .09,
    resizeMode: 'contain',
    marginLeft: 20,
  }
  ,


  imagesize: {
    position: 'relative',
    // left: width * 0.07,
    width: width * .08,
    height: height * .09,
    resizeMode: 'contain',
  },

  wiproimg: {
    position: 'relative',
    width: width * .1,
    height: height * .075,
    resizeMode: 'contain',
  },

  footerimg: {
    position: 'relative',
    width: width * .06,
    height: height * .065,
    resizeMode: 'contain',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

  },

  logoimage: {
    position: 'relative',
    width: width * .3,
    height: height * .075,
    resizeMode: 'contain',
  },

  leftItem: {
    position: 'relative',
    left: width * 0.04,
    flex: 1,
    alignItems: 'flex-start',
  },


  rightItem: {
    flex: 1,
    alignItems: 'flex-end',
    position: 'relative',
    right: width * 0.09,
  },
  rightItemA: {
    flex: 1,
    alignItems: 'flex-end',
    position: 'relative',
    right: width * 0.06,
  },

  centerItem: {
    flex: 1,
    alignItems: 'center',

  },

  horizontalscroll: {
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-between',
  },

  ml: {
    marginLeft: width * .055
  },
  textItem: {
    padding: 6,
    fontSize: 18,
    color: 'white'
  },
  bggreen: {
    backgroundColor: colors.bggreen,
  },
  bgred: {
    backgroundColor: colors.bgred,
  },
  textItemborderradius: {
    borderRadius: 5,
    width: width * .14
  },


  nextlinearbtn: {
    borderRadius: 16,
    width: width * .7,
    backgroundColor: colors.bglightblack,

  },

  subnmitlinearbtn: {
    borderRadius: 16,
    width: width * .8,
    backgroundColor: colors.bglightblack,
  },
  applylinearbtn: {
    borderRadius: 16,
    width: width * .5,
    backgroundColor: colors.bglightblack,
  },

  signup: {
    backgroundColor: colors.signupbgcolor,
    width: width * .7,
    padding: 10,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: height * .03
  },

  continuebtntext: {
    color: 'white',
    fontWeight: 'bold',
    padding: 16,
    fontSize: 16,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    // height: height *.08,
  },

  submitbtntext: {
    color: 'white',
    fontWeight: 'bold',
    padding: 8,
    marginVertical: 8,
    fontSize: 20,
    minWidth: 200,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },


  usebiometrictext: {
    color: 'white',
    fontWeight: 'bold',
    padding: 8,
    marginVertical: 8,
    fontSize: 20,
    // minWidth: 200,
    // width: '50%',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  usebiometricicon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginRight: 10,
  },


  // icons

  inputiconeye: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },

  inputicon2: {
    position: 'absolute',
    right: 8
  }
  ,
  backarrow: {
    position: 'relative',
    left: width * 0.07,
    width: width * .08,
    height: height * .075,
    resizeMode: 'contain',

  },

  backarrow1: {
    position: 'relative',
    left: width * 0.07,
    width: width * .08,
    height: height * .075,
    resizeMode: 'contain',
  },
  // icons ends here

  savepostimg: {
    position: 'absolute',
    right: width * .01,
    top: width * -.007,
    width: width * .2,
    height: height * .035,
    resizeMode: 'contain',
  },
  uploadimg: {
    position: 'absolute',
    right: width * -.06,
    width: width * .2,
    height: height * .022,
    resizeMode: 'contain', // Adjust the image's size and aspect ratio
  },


  center: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',

  },

  icon: {
    position: 'relative',
    left: width * .12,
    width: width * .05,
    height: height * .025,
    resizeMode: 'contain', // Adjust the image's size and aspect ratio
    zIndex: 99,
  },

  // placeholdercolor:{
  //   color: '#A4A4A4'
  // },



  readmoretext: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.lightgray,
    fontSize: 16,
    textDecorationLine: 'underline',
    position: 'relative',
    right: width * .06,
    letterSpacing: 1,

  },


  containerflex: {
    flex: 1,
  },

  imageBackground: {
    flex: 1,
    resizeMode: 'cover', // You can adjust the resizeMode property as needed
    height: height * .27,
    width: width * .85,
    position: 'relative',
    right: width * .033,
    borderRadius: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Black background with 60% opacity
    justifyContent: 'center',
    // alignItems: 'center',
    // width: width * .9,

    justifyContent: 'flex-start'
  },
  overlayText: {
    color: 'white',
    fontSize: 20,
    position: 'relative',
    top: height * .15,
    justifyContent: 'flex-start',
    fontWeight: 'bold',
    left: width * .025


  },
  overlayText2: {
    fontSize: 13,
    top: height * .18,
  },

  rowcenter2: {
    flexDirection: 'row', // Place texts side by side
    justifyContent: 'space-between', // Space between the two texts

  },

  leftItem2: {
    position: 'relative',
    left: width * .025,
    flex: 1,
    alignItems: 'flex-start',
  },

  flexDirectionrow: {
    flexDirection: "row"

  },


  rightItem2: {
    flex: 1,
    alignItems: 'flex-end',
    position: 'relative',
    right: width * .05,
  },

  leftText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 600
  },
  rightText: {
    color: 'white',
    fontSize: 12,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.lightgray,
    fontSize: 22,
  },

  title2: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.lightgray,
    fontSize: 26,
    // color: colors.lightgray,
  },

  blankwidgetbox: {
    borderRadius: 5,
    borderColor: 'rgba(0, 0, 0, 0.3)',
    width: width * .8,
    position: 'relative',
    left: width * .01,
    padding: width * .001,

  },
  topminus: {
    position: 'relative',
    top: height * - .02
  }
  ,

  marginLeft0: {
    left: width * .05,
  },

  marginLeft1: {
    left: width * .04,
  },
  marginLeft2: {
    left: width * .14,
  },
  marginLeft3: {
    left: width * .2,
  },
  marginRight1: {
    right: width * .05,
  },
  marginRight2: {
    right: width * .1,
  },
  marginRight3: {
    right: width * .12,
  },
  textleft: {
    textAlign: 'left ',
    justifyContent: 'flex-start',
  },
  textright: {
    textAlign: 'right',
    justifyContent: 'flex-end',
  },
  textlightgray: {
    color: colors.lightgray
  },
  textlightgray2: {
    color: colors.lightgray2
  },

  width100: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    //  height: height
  },



  widget2: {
    borderRadius: 5,
    backgroundColor: '#151413',
    shadowColor: 'rgba(255, 255, 255, .96)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
    // borderWidth: 2,
    // borderColor: 'rgba(0, 0, 0, 0.3)',
    borderColor: 'white',
    width: width * .85,
    position: 'relative',
    right: width * .033,
    padding: width * .001,
    paddingBottom: width * .05,
    // zIndex:999,
  },

  alertbox: {
    borderRadius: 5,
    borderColor: 'rgba(0, 0, 0, 0.3)',
    backgroundColor: '#151413',
    shadowColor: 'rgba(255, 255, 255, .96)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,

    width: width * .85,

    // justifyContent: 'center',
    // alignItems: 'center',

    // flex:1,
    padding: width * .001,
    paddingBottom: width * .05,
  },
  paddingleft1: {
    paddingLeft: width * .02,
  },
  paddingright02: {
    paddingRight: width * .02,
  },

  paddingbottom1: {
    paddingBottom: height * .15
  },

  paddingbottom2: {
    paddingBottom: height * .35
  },

  paddingtop: {
    paddingTop: height * .01,
  },

  paddingtopA: {
    paddingTop: height * 1,
  },

  fontnormal: {
    fontWeight: '300',
  },

  fontbold: {
    fontWeight: 'bold',
  },
  fontsize12: {
    fontSize: 12,
  },
  fontsize13: {
    fontSize: 13,
  },
  fontsize14: {
    fontSize: 14,
  },

  fontsize16: {
    fontSize: 16,

  },
  fontsize10: {
    fontSize: 10,

  },
  fontsize15: {
    fontSize: 15,

  },

  fontsize20: {
    fontSize: 20,
  },

  Nalignitems: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },

  widget2img: {
    width: width * .3, // Adjust the width of the images
    height: height * .1, // Adjust the height of the images

  },

  inputContainer: {
    // position: 'relative',
    flexDirection: 'row', // Arrange children horizontally
    alignItems: 'center', // Vertically align children in the middle
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: height * .03,
    width: width * .8,
    // color: 'red'
  },



  inputContainerwithoutborder: {
    paddingHorizontal: 10,
    marginTop: height * .02,
    width: width * .8,

  },


  inputContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 5,
    marginTop: height * .03,
    width: width * .3,
    position: 'relative',
    right: width * .05,
    height: height * .04

  },


  inputContainer4: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 5,
    marginTop: height * .03,
    position: 'relative',
    right: width * .05,
    height: height * .04,
    borderWidth: 1,
    borderColor: 'white',

  },



  inputContainer3: {
    // position: 'relative',
    flexDirection: 'row', // Arrange children horizontally
    alignItems: 'center', // Vertically align children in the middle
    paddingHorizontal: 10,
    marginTop: height * .03,
    width: width * .8,
    color: 'red'
  },


  textwhite: {
    color: colors.white,
    fontWeight: 'bold',
  },
  textwhitewithoutbold: {
    color: colors.white,
    fontWeight: 'bold',
  },


  textblack: {
    color: colors.black,
  },

  textred: {
    color: colors.red,
  },
  textgreen: {
    color: colors.green,
  },
  textgray: {
    color: colors.gray,
  },
  textgolden: {
    color: colors.golden,
    fontWeight: 'bold',
  },

  h2text: {
    marginTop: width * .07,
    paddingLeft: width * .07,
    paddingRight: width * .07,
  },

  createaccounttext: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray,
    textAlign: 'left',
  },


  poppinsfontm: {
    fontFamily: 'Poppins-Medium',
    color: 'white'
  },


  poppinsfontsb: {
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    fontWeight: 'bold'
  },

  mtlesthan1: {
    marginTop: height * .02,
  },
  mt1: {
    marginTop: height * .06,
  },
  mt2: {
    marginTop: height * .18
  },
  mta: {
    marginTop: height * .01,
  },

  grdientboxsize: {
    width: width * 0.05,
    //  borderRadius: 50,
    paddingLeft: 5
  },
  borderradius1: {

    borderRadius: 5,
  },

  paddinleft1: {
    paddingLeft: width * .02
  },
  rowcenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

  },

  scrollContent: {
    width: width,
    backgroundColor: colors.bgblack,
    paddingBottom: height * .15,
    alignItems: 'center',
  },

  container2: {
    flex: 1,
    backgroundColor: colors.bgblack,
    height: height,
    // alignItems: 'center',
    // position: 'relative',
    top: height * .06
  },

  topcontain: {
    flexDirection: 'row', // Arrange items horizontally
    alignItems: 'center', // Vertically center items

  },
  middleforgottext: {
    flex: 1, // Allow the container to take remaining space
    alignItems: 'center', // Center items horizontally
  },


  buttonContainer: {
    alignItems: 'center',
    marginTop: height * .05,
  },
  buttonContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // position: 'relative',
    left: width * - .025,
    marginTop: height * .05,
  },

  buttonContainer3: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // position: 'relative',
    left: width * - .022,
    marginTop: height * .03,
  },


  btnbgwhite: {
    backgroundColor: colors.bgwhite,
    color: colors.black,
  },

  btnbgcolor: {
    backgroundColor: colors.yellow,
    borderRadius: 16,
    width: width * .5,
    alignItems: 'center',

  },

  btnbgcolorgreen: {
    backgroundColor: colors.green,
    borderRadius: 20,
    width: width * .2,
    alignItems: 'center',
  },

  btnbgcolorred: {
    backgroundColor: colors.red,
    borderRadius: 20,
    width: width * .2,
    alignItems: 'center'
  },

  viewButton: {
    marginRight: 20,
    width: 80,
    height: 50,
  },

  deleteButton: {
    marginLeft: 20,
    width: 80,
    height: 50,
  },

  footeralerts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 20
  },



  // added by deepak 
  poppins: {
    fontFamily: 'poppins',
  }

});



