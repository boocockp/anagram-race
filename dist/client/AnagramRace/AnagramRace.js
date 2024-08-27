const runtimeUrl = window.elementoRuntimeUrl || 'https://elemento.online/lib/runtime.js'
const Elemento = await import(runtimeUrl)
const {React, trace, elProps, stateProps, wrapFn} = Elemento
const {importModule, importHandlers} = Elemento
const WordList = await import('../files/words2.js').then(...importHandlers('Words'))

// MainPage.js
function MainPage(props) {
    const pathTo = name => props.path + '.' + name
    const {Page, TextElement, Timer, Data, Calculation, Dialog, Button, Block, Icon, ScreenKeyboard} = Elemento.components
    const {Floor, Len, And, Not, Or, RandomFrom, Join, Shuffle, Split, Ceiling, Left, If, Eq, Lowercase, Trim, Lte} = Elemento.globalFunctions
    const {Reset, Set} = Elemento.appFunctions
    const _state = Elemento.useGetStore()
    const Status = _state.setObject(pathTo('Status'), new Data.State(stateProps(pathTo('Status')).value('Ready').props))
    const Score = _state.setObject(pathTo('Score'), new Data.State(stateProps(pathTo('Score')).value(0).props))
    const TheWord = _state.setObject(pathTo('TheWord'), new Data.State(stateProps(pathTo('TheWord')).props))
    const LettersShown = _state.setObject(pathTo('LettersShown'), new Data.State(stateProps(pathTo('LettersShown')).value(0).props))
    const Points = _state.setObject(pathTo('Points'), React.useCallback(wrapFn(pathTo('Points'), 'calculation', (word) => {
        return Floor(Len(word) * 2 - LettersShown * 3)
    }), [LettersShown]))
    const ScrambledWord = _state.setObject(pathTo('ScrambledWord'), new Data.State(stateProps(pathTo('ScrambledWord')).props))
    const GivenUp = _state.setObject(pathTo('GivenUp'), new Data.State(stateProps(pathTo('GivenUp')).value(false).props))
    const GameRunning = _state.setObject(pathTo('GameRunning'), new Calculation.State(stateProps(pathTo('GameRunning')).value(Or(Status == 'Playing', Status == 'Paused')).props))
    const EndGame = _state.setObject(pathTo('EndGame'), React.useCallback(wrapFn(pathTo('EndGame'), 'calculation', () => {
        return Set(Status, 'Ended')
    }), [Status]))
    const GameTimer_endAction = React.useCallback(wrapFn(pathTo('GameTimer'), 'endAction', async ($timer) => {
        await EndGame()
    }), [EndGame])
    const GameTimer = _state.setObject(pathTo('GameTimer'), new Timer.State(stateProps(pathTo('GameTimer')).period(180).interval(1).endAction(GameTimer_endAction).props))
    const PauseGame = _state.setObject(pathTo('PauseGame'), React.useCallback(wrapFn(pathTo('PauseGame'), 'calculation', () => {
        Set(Status, 'Paused')
        return GameTimer.Stop()
    }), [Status, GameTimer]))
    const Instructions = _state.setObject(pathTo('Instructions'), new Dialog.State(stateProps(pathTo('Instructions')).initiallyOpen(true).props))
    const StatsLayout = _state.setObject(pathTo('StatsLayout'), new Block.State(stateProps(pathTo('StatsLayout')).props))
    const ReadyPanel = _state.setObject(pathTo('ReadyPanel'), new Block.State(stateProps(pathTo('ReadyPanel')).props))
    const PausePanel = _state.setObject(pathTo('PausePanel'), new Block.State(stateProps(pathTo('PausePanel')).props))
    const PlayPanel = _state.setObject(pathTo('PlayPanel'), new Block.State(stateProps(pathTo('PlayPanel')).props))
    const QuestionLayout = _state.setObject(pathTo('QuestionLayout'), new Block.State(stateProps(pathTo('QuestionLayout')).props))
    const CluesLayout = _state.setObject(pathTo('CluesLayout'), new Block.State(stateProps(pathTo('CluesLayout')).props))
    const AnswerLayout = _state.setObject(pathTo('AnswerLayout'), new Block.State(stateProps(pathTo('AnswerLayout')).props))
    const Keyboard = _state.setObject(pathTo('Keyboard'), new ScreenKeyboard.State(stateProps(pathTo('Keyboard')).props))
    const StartNewWord = _state.setObject(pathTo('StartNewWord'), React.useCallback(wrapFn(pathTo('StartNewWord'), 'calculation', () => {
        let word = RandomFrom(WordList())
        Set(TheWord, word)
        Set(ScrambledWord, Join(Shuffle(Split(word))))
        Reset(LettersShown)
        Reset(Keyboard)
        return Reset(GivenUp)
    }), [TheWord, ScrambledWord, LettersShown, Keyboard, GivenUp]))
    const StartNewGame = _state.setObject(pathTo('StartNewGame'), React.useCallback(wrapFn(pathTo('StartNewGame'), 'calculation', () => {
        Reset(GivenUp)
        Reset(Score)
        Reset(GameTimer)
        Reset(TheWord)
        Reset(ScrambledWord)
        Set(Status, 'Playing')
        StartNewWord()
        return GameTimer.Start()
    }), [GivenUp, Score, GameTimer, TheWord, ScrambledWord, Status, StartNewWord]))
    const ContinueGame = _state.setObject(pathTo('ContinueGame'), React.useCallback(wrapFn(pathTo('ContinueGame'), 'calculation', () => {
        Set(Status, 'Playing')
        StartNewWord()
        return GameTimer.Start()
    }), [Status, StartNewWord, GameTimer]))
    const IsCorrect_whenTrueAction = React.useCallback(wrapFn(pathTo('IsCorrect'), 'whenTrueAction', async () => {
        Set(Score, Score + (await Points(TheWord)))
    }), [Score, Points, TheWord])
    const IsCorrect = _state.setObject(pathTo('IsCorrect'), new Calculation.State(stateProps(pathTo('IsCorrect')).value(And(Eq(Lowercase(Trim(Keyboard)), TheWord), Not(GivenUp))).whenTrueAction(IsCorrect_whenTrueAction).props))
    const Answering = _state.setObject(pathTo('Answering'), new Calculation.State(stateProps(pathTo('Answering')).value(And(TheWord, Not(IsCorrect), Not(GivenUp))).props))
    const WordButtons = _state.setObject(pathTo('WordButtons'), new Block.State(stateProps(pathTo('WordButtons')).props))
    const EndedPanel = _state.setObject(pathTo('EndedPanel'), new Block.State(stateProps(pathTo('EndedPanel')).props))
    const ControlsLayout = _state.setObject(pathTo('ControlsLayout'), new Block.State(stateProps(pathTo('ControlsLayout')).props))
    const StartGame2_action = React.useCallback(wrapFn(pathTo('StartGame2'), 'action', async () => {
        await StartNewGame()
        await Instructions.Close()
    }), [StartNewGame, Instructions])
    const NextWord_action = React.useCallback(wrapFn(pathTo('NextWord'), 'action', async () => {
        await StartNewWord()
    }), [StartNewWord])
    const GiveUp_action = React.useCallback(wrapFn(pathTo('GiveUp'), 'action', () => {
        Set(GivenUp, true)
    }), [GivenUp])
    const ShowALetter_action = React.useCallback(wrapFn(pathTo('ShowALetter'), 'action', () => {
        Set(LettersShown, LettersShown + 1)
    }), [LettersShown])
    const StartGame_action = React.useCallback(wrapFn(pathTo('StartGame'), 'action', async () => {
        await StartNewGame()
    }), [StartNewGame])
    const StopGame_action = React.useCallback(wrapFn(pathTo('StopGame'), 'action', async () => {
        await EndGame()
        await GameTimer.Stop()
    }), [EndGame, GameTimer])
    const PauseGame_action = React.useCallback(wrapFn(pathTo('PauseGame'), 'action', async () => {
        await PauseGame()
    }), [])
    const ContinueGame_action = React.useCallback(wrapFn(pathTo('ContinueGame'), 'action', async () => {
        await ContinueGame()
    }), [])
    const Instructions_action = React.useCallback(wrapFn(pathTo('Instructions'), 'action', async () => {
        await Instructions.Show()
    }), [])
    Elemento.elementoDebug(() => eval(Elemento.useDebugExpr()))

    return React.createElement(Page, elProps(props.path).styles(elProps(pathTo('MainPage.Styles')).props).props,
        React.createElement(TextElement, elProps(pathTo('Title')).styles(elProps(pathTo('Title.Styles')).fontSize('48').fontFamily('Luckiest Guy').color('#7529df').props).content('Mubjled Words').props),
        React.createElement(Timer, elProps(pathTo('GameTimer')).show(false).props),
        React.createElement(Data, elProps(pathTo('Status')).display(false).props),
        React.createElement(Data, elProps(pathTo('Score')).display(false).props),
        React.createElement(Data, elProps(pathTo('TheWord')).display(false).props),
        React.createElement(Data, elProps(pathTo('LettersShown')).display(false).props),
        React.createElement(Data, elProps(pathTo('ScrambledWord')).display(false).props),
        React.createElement(Data, elProps(pathTo('GivenUp')).display(false).props),
        React.createElement(Calculation, elProps(pathTo('Answering')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('GameRunning')).show(false).props),
        React.createElement(Dialog, elProps(pathTo('Instructions')).layout('vertical').showCloseButton(true).styles(elProps(pathTo('Instructions.Styles')).padding('2em').props).props,
            React.createElement(TextElement, elProps(pathTo('InstructionsText')).allowHtml(true).content(`You have 3 minutes to solve as many jumbled words as you can.


For each word you will see the scrambled version and the points you can earn.  Type your answer - you will see a tick when it is correct.


Click Skip Word to give up and show the answer.


Click Show A Letter to show up to three of the initial letters - but you will score fewer points.


Click Next Word to move on to the next word.


<b>Tips</b>
<ul>
<li>Words may be plural</li>
<li>You can Pause the game, but it will skip the word you're on</li>
</b>`).props),
            React.createElement(Button, elProps(pathTo('StartGame2')).content('Start Game').appearance('filled').show(Not(GameRunning)).action(StartGame2_action).props),
    ),
        React.createElement(Block, elProps(pathTo('StatsLayout')).layout('horizontal').styles(elProps(pathTo('StatsLayout.Styles')).fontSize('24').width('100%').justifyContent('space-between').props).props,
            React.createElement(TextElement, elProps(pathTo('ScoreDisplay')).show(Or(GameRunning, Status == 'Ended')).styles(elProps(pathTo('ScoreDisplay.Styles')).fontSize('inherit').color('blue').props).content(Score + ' points').props),
            React.createElement(TextElement, elProps(pathTo('TimeDisplay')).show(GameRunning).styles(elProps(pathTo('TimeDisplay.Styles')).fontSize('inherit').color('green').props).content(Ceiling(GameTimer. remainingTime) + 's left').props),
            React.createElement(TextElement, elProps(pathTo('GameOver')).show(Status == 'Ended').styles(elProps(pathTo('GameOver.Styles')).fontSize('inherit').color('white').backgroundColor('green').padding('0 0.5em').borderRadius('8px').props).content('Game Over').props),
    ),
        React.createElement(Block, elProps(pathTo('ReadyPanel')).layout('vertical').show(Status == 'Ready').styles(elProps(pathTo('ReadyPanel.Styles')).padding('0').props).props,
            React.createElement(TextElement, elProps(pathTo('Title')).styles(elProps(pathTo('Title.Styles')).color('#7529df').fontFamily('Luckiest Guy').fontSize('28').props).content('Welcome!').props),
            React.createElement(TextElement, elProps(pathTo('ReadyText')).styles(elProps(pathTo('ReadyText.Styles')).fontSize('20').props).content(`Un-jumble as many words as you can in 3 minutes

Click Instructions to learn how to play

Or Start Game to dive right in!`).props),
    ),
        React.createElement(Block, elProps(pathTo('PausePanel')).layout('vertical').show(Status == 'Paused').styles(elProps(pathTo('PausePanel.Styles')).padding('0').props).props,
            React.createElement(TextElement, elProps(pathTo('Title')).styles(elProps(pathTo('Title.Styles')).color('#7529df').fontFamily('Luckiest Guy').fontSize('28').props).content('Paused...').props),
            React.createElement(TextElement, elProps(pathTo('PauseText')).styles(elProps(pathTo('PauseText.Styles')).fontSize('20').props).content('Click Resume to carry on').props),
    ),
        React.createElement(Block, elProps(pathTo('PlayPanel')).layout('vertical').show(Status == 'Playing').styles(elProps(pathTo('PlayPanel.Styles')).width('100%').padding('0').props).props,
            React.createElement(Block, elProps(pathTo('QuestionLayout')).layout('horizontal').props,
            React.createElement(TextElement, elProps(pathTo('ScrambledLetters')).styles(elProps(pathTo('ScrambledLetters.Styles')).fontSize('20').letterSpacing('1px').props).content(ScrambledWord).props),
            React.createElement(TextElement, elProps(pathTo('PointsToWin')).styles(elProps(pathTo('PointsToWin.Styles')).paddingTop('3').marginLeft('5em').props).content(Points(TheWord) + ' points').props),
    ),
            React.createElement(Block, elProps(pathTo('CluesLayout')).layout('horizontal').props,
            React.createElement(TextElement, elProps(pathTo('StartsWith')).show(LettersShown > 0).styles(elProps(pathTo('StartsWith.Styles')).fontSize('20').letterSpacing('1px').props).content('Starts with: ' + Left(TheWord, LettersShown)).props),
    ),
            React.createElement(Block, elProps(pathTo('AnswerLayout')).layout('horizontal wrapped').styles(elProps(pathTo('AnswerLayout.Styles')).props).props,
            React.createElement(TextElement, elProps(pathTo('CurrentAttempt')).styles(elProps(pathTo('CurrentAttempt.Styles')).fontSize('20').border('2px solid lightgray').padding('1px 10px').borderRadius('5').minWidth('10em').height('32').props).content(If(GivenUp, TheWord,Keyboard)).props),
            React.createElement(Icon, elProps(pathTo('CorrectIndicator')).iconName('check_circle').show(IsCorrect).styles(elProps(pathTo('CorrectIndicator.Styles')).fontSize('40').color('green').props).props),
            React.createElement(TextElement, elProps(pathTo('WordPoints')).show(IsCorrect).content(Points(TheWord) + ' points added').props),
    ),
            React.createElement(Calculation, elProps(pathTo('IsCorrect')).show(false).props),
            React.createElement(ScreenKeyboard, elProps(pathTo('Keyboard')).useRealKeyboard(true).styles(elProps(pathTo('Keyboard.Styles')).width('100%').props).props),
            React.createElement(Block, elProps(pathTo('WordButtons')).layout('horizontal wrapped').props,
            React.createElement(Button, elProps(pathTo('NextWord')).content('Next Word').appearance('outline').show(Not(Answering)).enabled(GameTimer.isRunning).action(NextWord_action).props),
            React.createElement(Button, elProps(pathTo('GiveUp')).content('Skip Word').appearance('outline').show(Answering).action(GiveUp_action).props),
            React.createElement(Button, elProps(pathTo('ShowALetter')).content('Show A Letter').appearance('outline').show(Answering).enabled(Lte(LettersShown, 2)).action(ShowALetter_action).props),
    ),
    ),
        React.createElement(Block, elProps(pathTo('EndedPanel')).layout('vertical').show(Status == 'Ended').styles(elProps(pathTo('EndedPanel.Styles')).padding('0').props).props,
            React.createElement(TextElement, elProps(pathTo('TextA')).styles(elProps(pathTo('TextA.Styles')).fontFamily('Luckiest Guy').fontSize('28').color('#7529df').props).content('Congratulations!').props),
            React.createElement(TextElement, elProps(pathTo('Text16')).content('You have scored ' + Score + ' points!').props),
            React.createElement(TextElement, elProps(pathTo('Text17')).content('Click Start Game to have a another go').props),
    ),
        React.createElement(Block, elProps(pathTo('ControlsLayout')).layout('horizontal').props,
            React.createElement(Button, elProps(pathTo('StartGame')).content('Start Game').appearance('filled').show(Not(GameRunning)).action(StartGame_action).props),
            React.createElement(Button, elProps(pathTo('StopGame')).content('Stop Game').appearance('outline').show(GameRunning).action(StopGame_action).props),
            React.createElement(Button, elProps(pathTo('PauseGame')).content('Pause Game').appearance('outline').show(Status == 'Playing').action(PauseGame_action).props),
            React.createElement(Button, elProps(pathTo('ContinueGame')).content('Resume').appearance('outline').show(Status == 'Paused').action(ContinueGame_action).props),
            React.createElement(Button, elProps(pathTo('Instructions')).content('Instructions').appearance('outline').action(Instructions_action).props),
    ),
    )
}

// appMain.js
export default function AnagramRace(props) {
    const pathTo = name => 'AnagramRace' + '.' + name
    const {App} = Elemento.components
    const pages = {MainPage}
    const appContext = Elemento.useGetAppContext()
    const _state = Elemento.useGetStore()
    const app = _state.setObject('AnagramRace', new App.State({pages, appContext}))

    return React.createElement(App, {...elProps('AnagramRace').maxWidth('600px').fonts(['Luckiest+Guy']).props},)
}
