from boggle import Boggle
from flask import Flask,request, render_template , redirect , flash ,jsonify,session
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config['SECRET_KEY'] = "chickensRcool"

app.config['DEBUG_TB_INTERCEPT_REDIRECTS']= False
debug = DebugToolbarExtension(app)

boggle_game = Boggle()

@app.route('/')
def homepage():
    """ Display Board"""
    board = boggle_game.make_board()
    """Set board in session"""
    session['board'] = board
    """Set Highscore and Number of plays in session"""
    highscore = session.get('highscore',0)
    nplays = session.get('nplays',0)
    return render_template('home.html',board = board , nplays = nplays , highscore = highscore)


@app.route('/check-word')
def check_word():
    """Check if word is in dictionary."""

    word = request.args["word"]
    board = session["board"]
    response = boggle_game.check_valid_word(board, word)

    return jsonify({'result': response})

@app.route("/post-score", methods=["POST"])
def post_score():
    """Receive score, update nplays, update high score if appropriate."""

    score = request.json["score"]
    highscore = session.get("highscore", 0)
    nplays = session.get("nplays", 0)

    session['nplays'] = nplays + 1
    session['highscore'] = max(score, highscore)

    return jsonify(brokeRecord=score > highscore)