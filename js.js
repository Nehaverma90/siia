var iframeContent = {
    template: '<html><head><style>{{styles}}</style><head><body>{{content}}<body></html>',
    styles: ['@media print {',
                '@page { size:210mm 297mm; margin: 0mm; }',
                'html { margin: 0px; }',
                '.printable { margin: 20mm 15mm 10mm 15mm; }',
                '.letter {font-family: "Times New Roman; Serif"; font-size: 12pt; page-break-after: always; text-align: justify;}',
                '.letter-para::before {content:"    "; }',
            '}'].join("")
};


var personType = {
    mySelf: 'mySelf',
    // senator1: 'senator1',
    // senator2: 'senator2',
    // representative: 'representative'
    congressMember: 'congressMember'
}
function Person (personType, name, streetAddress, city, state, zip, email, phoneNumber) {
    this.personType = personType;
    this.name = name;
    this.streetAddress = streetAddress;
    this.city = city;
    this.state = state;
    this.zip = zip;
    this.email = email;
    this.phoneNumber = phoneNumber;
}

function Letter (mySelf, officials, personalMessage ){
    this.mySelf =  mySelf, // mySelf Person object
    this.officials = officials;  //array of official `Person` objects
    this.personalMessage = personalMessage;
};


Letter.prototype._letter = [ '<div class="printable letter">',
    '{{date}}<br><br>',
    'From,<br>',
    '  <b>{{name}}</b>,<br>',
    // '  {{streetAddress}},',
    '  {{city}},<br>',
    '  {{state}} {{zip}},<br>',
    '  {{email}}<br>',
    '  {{phoneNumber}}<br>',
    'To,<br>',
    '  <b>{{rep_name}}</b>,<br>',
    '  {{rep_streetAddress}},<br>',
    '  {{rep_city}},<br>',
    '  {{rep_state}} {{rep_zip}}<br>',
    '<br>',
    'Dear {{rep_name}},<br>',
    '<p class="letter-para">{{paragraph1}}</p>',
    '<p class="letter-para">{{personalMessage}}</p>',
    '<p class="letter-para">{{paragraph2}}</p>',
    '<p class="letter-para">{{paragraph3}}</p>',
    'Yours sincerely,<br>',
    '<br>',
    '<br>',
    '<b>{{name}}</b><br>',
    '<br>',
    '<br>',
    "</div>"].join('\n');

Letter.prototype._content = {
    paragraph1: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sapien mi, auctor sit amet mauris nec, ornare dictum est. Curabitur arcu neque, fermentum ut mollis quis, suscipit sed orci. Sed bibendum eu metus quis vehicula. Vivamus sollicitudin lorem at molestie blandit. Nam dictum turpis magna, sit amet tempus lacus mollis non. Curabitur facilisis sapien ut dignissim mattis. Cras porttitor mauris at purus euismod, non dignissim libero suscipit. Nulla tellus arcu, venenatis nec condimentum vitae, elementum id nunc. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
    paragraph2: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sapien mi, auctor sit amet mauris nec, ornare dictum est. Curabitur arcu neque, fermentum ut mollis quis, suscipit sed orci. Sed bibendum eu metus quis vehicula. Vivamus sollicitudin lorem at molestie blandit. Nam dictum turpis magna, sit amet tempus lacus mollis non. Curabitur facilisis sapien ut dignissim mattis. Cras porttitor mauris at purus euismod, non dignissim libero suscipit. Nulla tellus arcu, venenatis nec condimentum vitae, elementum id nunc. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
    paragraph3: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sapien mi, auctor sit amet mauris nec, ornare dictum est. Curabitur arcu neque, fermentum ut mollis quis, suscipit sed orci. Sed bibendum eu metus quis vehicula. Vivamus sollicitudin lorem at molestie blandit. Nam dictum turpis magna, sit amet tempus lacus mollis non. Curabitur facilisis sapien ut dignissim mattis. Cras porttitor mauris at purus euismod, non dignissim libero suscipit. Nulla tellus arcu, venenatis nec condimentum vitae, elementum id nunc. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
}

Letter.prototype.generate = function() {
    var letters = [];
    //inner function - refactor
    var that = this;
    var replaceContent = function(letter, prefix, key, value) {
        //skim undefined values
        var value= value ? value : "";
        //html escape
        value = that._escapeHtml(value);
        letter = letter.replace(new RegExp('{{' + prefix + key +'}}', 'g'), value);
        return letter;
    }
    //inner function - refactor
    var processPersons = function (person, letter) {
        var prefix = person.personType === personType.mySelf? '': 'rep_';
        for (var key in person){
            if (person.hasOwnProperty(key)){
                letter = replaceContent(letter, prefix, key, person[key]);
            }
        }
        return letter;
    }

    var mySelf = this.mySelf;
    var officials = this.officials;

    /*generate personalized letters for each official*/
    for (var j = 0; j < officials.length; j++) {
        var letter = processPersons (mySelf, new String(this._letter));
        var date = new Date();
        letter = replaceContent(letter, "", 'date', (date.getMonth()+1) + '/' + date.getDate() + "/" + date.getFullYear());
        letter = replaceContent(letter, "", 'paragraph1', this._content.paragraph1);
        letter = replaceContent(letter, "", 'paragraph2', this._content.paragraph2);
        letter = replaceContent(letter, "", 'paragraph3', this._content.paragraph3);
        letter = replaceContent(letter, "", 'personalMessage', this.personalMessage);
        letter = processPersons (officials[j], letter);
        letters.push(letter);
    }

    return letters;
};

Letter.prototype._entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
};

Letter.prototype._escapeHtml = function(string) {
  return String(string).replace(/[&<>]/g, function (s) {
    return this._entityMap[s];
  });
};


  $(document).ready(function() {
    $('#generate_button').on('click', function(e) {
        //Person (personType, name, streetAddress, city, state, zip, email, phoneNumber) {
        var mySelf = new Person(personType.mySelf,
                                $('#first_name').val() +" "+ $('#last_name').val(),
                                $('#address').val(),
                                $('#city').val(),
                                $('#state').val(),
                                $('#zip').val(),
                                $('#email').val(),
                                $('#phone').val()
                                );
        var personalMessage = $('#personal_story').val();

        var params = {
            address: [mySelf.streetAddress, mySelf.city, mySelf.state, mySelf.zip].join(", "),
            includeOffices: true,
            levels: 'country',
            roles: ['legislatorLowerBody', 'legislatorUpperBody'],
            alt: 'json',
            key: 'AIzaSyCfudVJCHJaYtdAE2UsiTT0G-yrvPS4jnc'
        };

        var defaultErrorMessage = 'Unable to Locate your congress member. Please provide a valid address.\n'
        $.ajax("https://content.googleapis.com/civicinfo/v2/representatives", {
            data: params,
            traditional: true,
            success: function(result){
                console.log(result);
                //process response


                try {
                    var officialsForLetter = [];
                    var resultOfficials  = result.officials;
                    for (var i = 0 ;i < resultOfficials.length; i++) {
                        //Person (personType, name, streetAddress, city, state, zip, email, phoneNumber) {
                        var official= resultOfficials[i];
                        var address = official.address[0];
                        var officialPerson = new Person(personType.congressMember,
                                                official.name,
                                                address.line1,
                                                address.city,
                                                address.state,
                                                address.zip,
                                                "", //email
                                                "" //phoneNumber
                                                );
                        officialsForLetter.push(officialPerson)
                    }
                    var letter = new Letter(mySelf, officialsForLetter, personalMessage);
                    letters = letter.generate();
                    letters = letters.join('');
                    $('#message_body').html(letters);
                    $('.modal').modal('show');
                } catch (e) {
                    alert(defaultErrorMessage + "Error parsing API result\n" + e);
                }
            },
            error: function(result){
                alert(defaultErrorMessage);
            }
        });
    });

    $('#print_letter').on('click', function() {
        var letterContent = $('#message_body').html();
        var printIframe = $('#print_iframe')[0];
        var iframeDoc = printIframe.contentDocument;
        var contentToWrite = iframeContent.template;
        contentToWrite = contentToWrite.replace('{{styles}}', iframeContent.styles);
        contentToWrite = contentToWrite.replace('{{content}}', letterContent);
        iframeDoc.open();
        iframeDoc.write(contentToWrite);
        iframeDoc.close();
        printIframe.focus();
        printIframe.contentWindow.print();
    });
});


