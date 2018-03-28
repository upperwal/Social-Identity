pragma solidity ^0.4.11;

contract IssuingAuthority {

    struct dataMapper {
        mapping(bytes32 => string) data;
    }

    mapping(address => dataMapper) private users;
    address _owner;
    string name;

    bytes32[] private fields;
    uint private fieldsCount;
   

    function IssuingAuthority(address add, bytes32[] _fields, string _name) public {
        _owner = add;
        fieldsCount = _fields.length;
        name = _name;

        for(uint i=0; i<_fields.length; i++) {
            fields.push(_fields[i]);
        }
    }
    
     modifier issuingAuthorityAccess() {
        require(msg.sender == _owner);
        _;
    }

    function getFieldNameValuePair(uint i) view public returns(bytes32, string) {
        if(i > fieldsCount)
            return ("NULL", "NULL");
        return (fields[i], users[msg.sender].data[fields[i]]);
    }

    function updateData(address uid, bytes32 fieldName, string fieldValue) public issuingAuthorityAccess {
        users[uid].data[fieldName] = fieldValue;
    }

    function changeOwner(address add) public issuingAuthorityAccess {
        // if owner forgot his keys.
        _owner = add;
    }

    function getNumberOfFields() view public returns(uint) {
        return fieldsCount;
    }

    function getFields(uint i) view public returns(bytes32) {
        return fields[i];
    }

    function getOwner() view public returns(address) {
        return _owner;
    }

    function getIAName() view public returns(string) {
        return name;
    }
}

contract Sharing {

    struct DataPoint {
        string data;
        string approvedData;
        uint endTime;
        bool valid;
    } 
    
    event SendForApproval(address user, address citizen, string reqdata);
    
    

    mapping(address => mapping(address => DataPoint)) sharingDataPoints;
    mapping(address => DataPoint) sharingDataPointsOpen;
    mapping(address => bool) lockDetails;
    mapping(address => address[]) approvedCompanies;
    mapping(address => string) serviceProviderName;



    function Sharing() public {

    }

    /*function request(address userId, string data) public {
        
    }*/

    function approve(string _data, string _approvedData, address approvedTo, uint eTime) public {
        require(lockDetails[msg.sender] == false);

        if(approvedTo == address(0)) {
            sharingDataPointsOpen[msg.sender].data = _data;
            sharingDataPointsOpen[msg.sender].approvedData = _approvedData;
            if(eTime > 0)
                sharingDataPointsOpen[msg.sender].endTime = now + eTime;
        }
        else {
            sharingDataPoints[msg.sender][approvedTo].data = _data;
            sharingDataPoints[msg.sender][approvedTo].approvedData = _approvedData;
            if(eTime > 0)
                sharingDataPoints[msg.sender][approvedTo].endTime = now + eTime;
            
            approvedCompanies[msg.sender].push(approvedTo);
        }
        
        //Event possible.
    }

    function modifyApproval(string newEncryptedData, address approvedTo, string newApprovedData) public {
        if(approvedTo == address(0)) {
            sharingDataPointsOpen[msg.sender].data = newEncryptedData;
            sharingDataPointsOpen[msg.sender].approvedData = newApprovedData;
        }
        else {
            sharingDataPoints[msg.sender][approvedTo].data = newEncryptedData;
            sharingDataPoints[msg.sender][approvedTo].approvedData = newApprovedData;
        }
        
    }

    function getData(address add) view public returns(string, string) {
        require(lockDetails[add] == false && now < sharingDataPoints[add][msg.sender].endTime);
        
        // Sends encrypted data with key of service provider.
        return(sharingDataPoints[add][msg.sender].data, sharingDataPoints[add][msg.sender].approvedData);
    }

    function getOpenData(address add) view public returns(string, string) {
        require(lockDetails[add] == false && now < sharingDataPointsOpen[add].endTime);

        // Sends encrypted data with open key
        return(sharingDataPointsOpen[add].data, sharingDataPointsOpen[add].approvedData);
    }
    
    // Service provider to customer
    /* function requestApproval(address user, string _reqData) public returns(bool) {
        require(lockDetails[user] == false);
        if(sharingDataPoints[msg.sender][user].valid == false) {
            SendForApproval(msg.sender, user, _reqData);
            return false;
        }
        return true;
    } */

    function lock() public {
        require(lockDetails[msg.sender] == false);
        lockDetails[msg.sender] = true;
    }

    function unlock() public {
        require(lockDetails[msg.sender] == true);
        lockDetails[msg.sender] = false;
    }

    function getApprovedNumberOfCompanies() view public returns(uint) {
        return approvedCompanies[msg.sender].length;
    }

    function getApprovedCompanies(uint p) view public returns(address[5] result) {
        uint len = approvedCompanies[msg.sender].length;
        if(len > 5)
            len = 5;
        for(uint i=0;i<len;i++) {
            result[i] = approvedCompanies[msg.sender][i + p];
        }
        for(uint j = len; j<5; j++) {
            result[j] = address(0);
        }

        return result;
    }

    function getApprovedData(address company_id) view public returns(string) {
        require(now < sharingDataPoints[msg.sender][company_id].endTime);
        return sharingDataPoints[msg.sender][company_id].approvedData;
    }

    function registerAsServiceProvider(string name) public {
        serviceProviderName[msg.sender] = name;
    }

    function getServiceProviderName(address add) view public returns(string) {
        return serviceProviderName[add];
    }
}

contract SuperUser {
    address private superuser;
    mapping(address => address) private IAList;
    uint IASize;
    address private sharingContract;
    address[] private IAVector;
    mapping(bytes32 => uint) private fieldToIAAddress;

    modifier superuserAccess() {
        require(msg.sender == superuser);
        _;
    }

    function SuperUser() public {
        superuser = msg.sender;
        sharingContract = new Sharing();
        IASize = 0;
    }

    function addIssuingAuthority(string name, address add, bytes32[] fields) public superuserAccess {
        IAList[add] = new IssuingAuthority(add, fields, name);
        IAVector.push(add);
        
        for(uint i=0;i<fields.length;i++) {
            fieldToIAAddress[fields[i]] = IASize;
        }
        IASize++;
    }

    function getIAContractAddress(address IAAdd)view public returns(address) {
        return IAList[IAAdd];
    }

    function getSharingContract() view public returns(address) {
        return sharingContract;
    }

    function getNumberOfIA() view public returns(uint) {
        return IASize;
    }

    function getIAAddressContract(uint i) view public returns(address, address) {
        return (IAVector[i], IAList[IAVector[i]]);
    }

    function getSuperuser() view public returns(address) {
        return superuser;
    }

    function getAccount() view public returns(address) {
        return msg.sender;
    }

    function getIAFromField(bytes32 field) view public returns(address) {
        return IAVector[fieldToIAAddress[field]];
    }

    /*function destroyIAContracts() public superuserAccess {

    }*/

}
