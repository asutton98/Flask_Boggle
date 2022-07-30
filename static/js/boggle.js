class BoggleGame{
    constructor(boardId, secs = 60){
        this.secs = secs;
        this.score = 0;
        this.words = new Set();
        this.board = $("#" + boardId);

        this.timer = setInterval(this.tick.bind(this),1000);

        $(".add-word" , this.board).on("submit", this.handleSubmit.bind(this))
    }
    // show word in list of words
    showWord(word){
        $(".words",this.board).append($("<li>",{text: word}))
    }

    showScore(){
        $(".score",this.board).text(this.score)
    }

    showMessage(msg,cls){
        $(".msg",this.board).text(msg).removeClass().addClass(`msg ${cls}`)
    }

    async handleSubmit(e){
        e.preventDefault();
        const $word = $('.word',this.board);

        let word = $word.val();
        if(!word)return;

        if(this.words.has(word)){
            this.showMessage(`Already found ${word}`,"error");
            return;
        }

         // check server for validity
        const res = await axios.get("/check-word",{params:{word:word}});
        if(res.data.result === "not-word"){
            this.showMessage(`${word} is not a valid English word`,"error");
        }else if(res.data.result === "not-on-board"){
            this.showMessage(`${word} is not a valid word on this board`,"error")
        }else{
            this.showWord(word);
            this.score += word.length;
            this.showScore();
            this.words.add(word);
            this.showMessage(`Added: ${word}`,"success")
        }
        $word.val("").focus();
    }
    
    showTimeer(){
        $(".timer",this.board).text(this.secs);
    }

    async tick(){
        this.secs -= 1;
        this.showTimer();

        if(this.secs === 0){
            clearInterval(this.timer);
            await this.scoreGame();
        }
    }

    async scoreGame(){
        $('.add-word',this.board).hide();
        const res = await axios.post("/post-score",{score:this.score});
        if(res.data.brokeRecord){
            this.showMessage(`New record:${this.score}`,"success");
        }else{
            this.showMessage(`Final Score: ${this.score}`,"success")
        }
    }
}