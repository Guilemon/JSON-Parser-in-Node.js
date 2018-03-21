var fs = require("fs") //require fs module to read filesystem operations

var data = fs.readFileSync("input.txt","utf8").replace(/[\r\n]+/g,''),
    mainProfile = splitString(subString(data,0,data.indexOf("**")),"|"),
    followers = subString(data,data.indexOf("**")),
    name = splitString(mainProfile[2],">")//convert name data to array,
    location = splitString(mainProfile[3],">")//convert location data to array,
    allFollowers = splitString(subString(followers,followers.indexOf("|")),"@@")//seperate each follower and add in an array

/**Function to get substring of element
  *param:
  * @elem - string to be processed
  * @start - start from
  * @end - end point(if not provided defaults to end of string)
  */
function subString(elem,start,end=elem.length){
    return elem.substring(start,end)
}

/**Function to split the string to an array
  *param:
  * @elem - string to be processed
  * @splitBy - split the element
  */
function splitString(elem,splitBy){
    return elem.split(splitBy)
}

/**Checks if array of values is defined, if undefined returns empty string
  *param:
  * @elem - string to be processed
  * @trim - start value for substring function
  */
function chckEmptyData(elem,trim){
    if(typeof elem!=="undefined"){
        return subString(elem,trim)
    }else{
        return ""
    }
}

/**Returns object containing name information
  *param:
  * @elem - array containing name - first,middle,last
  */
function getNameData(elem){
    return ({
         "first":chckEmptyData(elem[0],1),
         "middle":chckEmptyData(elem[1],1),
         "last":chckEmptyData(elem[2],1)
      })
}

/**Returns object containing location information
  *param:
  * @elem - array containing name - name,coords-long,lat
  */
function getLocationData(elem){
    return({
          "name":chckEmptyData(elem[0],1),
          "coords":{
              "long":parseFloat(chckEmptyData(elem[1],2))||"",
              "lat":parseFloat(chckEmptyData(elem[2],1))||""
        }
    })
}

/**Returns object containing location information
  *param:
  * @elem - array containing id,imageId
  * @nameDetails - can pass variable or function returning name details
  * @locationDetails - can pass variable or function returning location details
  */
function mainProfileData(elem,nameDetails,locationDetails){
    var myObj = {
        "id":elem[1],
        "name":nameDetails,
        "location":locationDetails,
        "imageId":elem[4]
    }
    return myObj
}

/**Initialize empty array to store followers data
  *Iterate array containing strings of each follower
  * split each string into array and pass respective indexes as
  * param to functions returning objects
  * Push each object to array
  */
var arr =[] //empty array initialized for storing followers data
for(var k = 0; k<allFollowers.length;k++){
    var getFollower = (allFollowers[k].split("|"));
    var getJsonFollower = mainProfileData(getFollower,getNameData(getFollower[2].split(">")),getLocationData(getFollower[3].split(">")))
    arr.push(getJsonFollower)
}

/**Assign user data object to a variable
  *Assign follower data object to a variable
  * Use Object.assign function to merge follower object to user object
  * stringify the object to get JSON format
  * Prettify and print output to console
  */
var user = mainProfileData(mainProfile,(getNameData(name)),getLocationData(location))
var follower ={"followers": arr}
user = Object.assign(user,follower)

console.log(JSON.stringify(user,null,4))
