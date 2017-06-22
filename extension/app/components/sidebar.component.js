function SideBarComponent(dependencies) {
    Component.call(this, {
        selector: 'weight-in-sidebar',
        templateUrl: 'app/components/sidebar.component.html'
    });
    this.width = 350;
    var self = this;
    this.show = function () {
        self.page.style.width = (document.documentElement.offsetWidth - this.width) + 'px';
        this.el.style.right = '0';
    };

    this.hide = function () {
        self.page.style.width = document.documentElement.offsetWidth + 'px';
        this.el.style.right = (-self.width) + 'px';
    };

    this.wrapPageContent = function () {
        self.page = document.createElement("weight-in-page");

        while (document.body.firstChild)
            this.page.appendChild(document.body.firstChild);
        document.body.appendChild(this.page);
        self.hide();
    };

    this.addComment = function() {
        var user = dependencies.appStateService.getState().currentUser,
            body = self.textfield.value;

        dependencies.commentService.addComment(user, window.location.href, body);
        self.textfield.value = "";
        self.scrollToBottom();
    };

    this.scrollToBottom = function () {
        var list = this.el.querySelector("#weigh-in-sidebar-comment-list");
        list.scrollTop = list.scrollHeight;
    };

    dependencies.appStateService.subscribe(function () {
        self.update({comments: dependencies.appStateService.getState().comments.map(function (comment) {
            var newComment = Object.create(comment);
            newComment.created_at = moment(comment.created_at).fromNow();
            return newComment;
        })});
        self.scrollToBottom();
    });


    this.wrapPageContent();
}

SideBarComponent.prototype = Object.create(Component.prototype);

Component.prototype.bindEventListeners = function () {
    var self = this;
    this.textfield = this.el.querySelector("#weigh-in-comment-input");
    this.textfield.addEventListener('keypress', function (e) {
        if(e.keyCode === 13) {
            self.addComment();
        }
    });

    var sendButton = this.el.querySelector('#weigh-in-send-button');
    sendButton.addEventListener('click', self.addComment);
};