var ActivityCreateView = Backbone.View.extend({
    el: '#new_activity',
    initialize: function(){
        _.bindAll(this, 'newAct', 'render', 'changeType', 'includeLocation', 'sendMessage', 'fileSelected');

        this.trimForServer = App.helper.trimForServer;

        var streamName = App.desiredStream;
        var verb = this.trimForServer(App.metadata.verbs[0]);
        var objectType = this.trimForServer(App.metadata.objectTypes[0]);

        this.newAct(streamName, verb, objectType);
        this.render();
    },
    events: {
        "click .type-select" : "changeType",
        "click #includeLocation" : "includeLocation",
        "click #send-message" : "sendMessage",
        "change #input-file-input" : "fileSelected"
    },
    newAct : function(streamName, verb, objectType) {
        this.streamName = streamName;
        this.model = new Activity({
            object: {content: '', objectType: objectType, title: '', url: ''},
            verb: verb,
            streams: [streamName]
        });
    },
    render: function(){
        var actData = this.model.toJSON();
        this.$el.find("#specific-activity-input").html(jade.templates[actData.object.objectType]({act: actData}));

        if(!actData.object.image) {
            var actView = this;
            $('#new_photo').ajaxForm(function(data) {
                if (data && data.object && data.object.objectType == "photo") {
                    actView.model.set('object', data.object);
                    actView.render();
                } else {
                    alert("File rejected. Please check its a valid image.")
                }
            });
        }

      return this; // for chainable calls, like .render().el
    },
    changeType : function(event) {
        console.log(event);
        var itemName = $(event.target).data("type-show");
        if (itemName) {
            $("#" + itemName)[0].innerHTML = event.target.text + " &nbsp;";
            var val = this.trimForServer(event.target.text);
            if (itemName == "verb-show") {
                this.model.set('verb', val);
            } else {
                var obj = this.model.get('object');
                obj.objectType = val;
                this.model.set('object', obj);
            }
        }
        this.render();
    },
    includeLocation : function(event) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(App.helper.getLocation);
        } else {
            alert("Geo Location is not supported on your device");
        }
    },
    sendMessage : function() {
        console.log("In send message");

        var obj = this.model.get('object');
        obj.content = $("#msg").val();
        obj.url = $('#url').val();
        obj.title = $('#title').val();
        obj.objectType = this.trimForServer($('#object-show'));
        this.model.set('object', obj);

        var streamName = $('#streamName').val();
        this.model.set('streams', [streamName]);

        var verb = this.trimForServer($('#verb-show'));
        this.model.set('verb', verb);

        if (this.model.isValid()) {
            if (this.model.save()) {
                this.newAct(streamName, verb, obj.objectType);
                this.render();
            }
        }

    },
    fileSelected : function(event){

        if (event.target.files && event.target.files[0]) {
            var file = event.target.files[0];
            this.file = file;
            console.dir(file);
            $('#title').val(file.name);
        }
        this.$el.find("#new_photo").submit();
    }
});