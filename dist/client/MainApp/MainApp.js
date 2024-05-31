const runtimeUrl = window.elementoRuntimeUrl || 'https://elemento.online/lib/runtime.js'
const Elemento = await import(runtimeUrl)
const {React} = Elemento
const {importModule, importHandlers} = Elemento
const WordList = await import('../files/words1.js').then(...importHandlers('Words'))

// MainPage.js
function MainPage(props) {
    const pathWith = name => props.path + '.' + name
    const {Page, TextElement, Button, Timer, Data, Calculation, Layout, TextInput, Icon} = Elemento.components
    const {Floor, Len, And, Not, Ceiling, If, Eq, RandomFrom, Join, Shuffle, Split} = Elemento.globalFunctions
    const {Reset, Set} = Elemento.appFunctions
    const _state = Elemento.useGetStore()
    const GameTimer = _state.setObject(pathWith('GameTimer'), new Timer.State({period: 180, interval: 1}))
    const Score = _state.setObject(pathWith('Score'), new Data.State({value: 0}))
    const TheWord = _state.setObject(pathWith('TheWord'), new Data.State({}))
    const Points = React.useCallback((word) => {
        return Floor(Len(word) * 1.5)
    }, [])
    const ScrambledWord = _state.setObject(pathWith('ScrambledWord'), new Data.State({}))
    const GivenUp = _state.setObject(pathWith('GivenUp'), new Data.State({value: false}))
    const Attempt = _state.setObject(pathWith('Attempt'), new TextInput.State({value: If(GivenUp, TheWord, '')}))
    const IsCorrect_whenTrueAction = React.useCallback(async () => {
        Set(Score, Score + (await Points(TheWord)))
    }, [Score, Points, TheWord])
    const IsCorrect = _state.setObject(pathWith('IsCorrect'), new Calculation.State({value: And(Eq(Attempt, TheWord), Not(GivenUp)), whenTrueAction: IsCorrect_whenTrueAction}))
    const Answering = _state.setObject(pathWith('Answering'), new Calculation.State({value: And(TheWord, Not(IsCorrect), Not(GivenUp))}))
    const StartGame_action = React.useCallback(async () => {
        Reset(Attempt)
        Reset(GivenUp)
        Reset(Score)
        Reset(GameTimer)
        Reset(TheWord)
        Reset(ScrambledWord)
        await GameTimer.Start()
    }, [Attempt, GivenUp, Score, GameTimer, TheWord, ScrambledWord])
    const StartWord_action = React.useCallback(async () => {
        let word = RandomFrom(await WordList())
        Set(TheWord, word)
        Set(ScrambledWord, Join(Shuffle(Split(word))))
        Reset(Attempt)
        Reset(GivenUp)
        await Attempt.Focus()
    }, [TheWord, ScrambledWord, Attempt, GivenUp])
    const GiveUp_action = React.useCallback(() => {
        Set(GivenUp, true)
    }, [GivenUp])
    Elemento.elementoDebug(eval(Elemento.useDebugExpr()))

    return React.createElement(Page, {path: props.path},
        React.createElement(TextElement, {path: pathWith('Title'), styles: {fontSize: 24}}, 'Anagram Race'),
        React.createElement(Button, {path: pathWith('StartGame'), content: 'Start Game', appearance: 'outline', action: StartGame_action}),
        React.createElement(Timer, {path: pathWith('GameTimer'), show: true}),
        React.createElement(Data, {path: pathWith('Score'), display: false}),
        React.createElement(Data, {path: pathWith('TheWord'), display: false}),
        React.createElement(Data, {path: pathWith('ScrambledWord'), display: false}),
        React.createElement(Data, {path: pathWith('GivenUp'), display: false}),
        React.createElement(Calculation, {path: pathWith('Answering'), show: false}),
        React.createElement(Layout, {path: pathWith('StatsLayout'), horizontal: true, wrap: false, styles: {fontSize: '32'}},
            React.createElement(TextElement, {path: pathWith('ScoreDisplay'), styles: {fontSize: 'inherit', color: 'blue'}}, Score + ' points'),
            React.createElement(TextElement, {path: pathWith('TimeDisplay'), styles: {fontSize: 'inherit', color: 'green', marginLeft: '100'}}, Ceiling(GameTimer. remainingTime) + ' seconds left'),
    ),
        React.createElement(TextElement, {path: pathWith('ScrambledLetters')}, ScrambledWord),
        React.createElement(Layout, {path: pathWith('AnswerLayout'), horizontal: true, wrap: true},
            React.createElement(TextInput, {path: pathWith('Attempt'), label: 'Your Answer', readOnly: Not(Answering)}),
            React.createElement(Icon, {path: pathWith('CorrectIndicator'), iconName: 'check_circle', show: IsCorrect, styles: {fontSize: '40', color: 'green'}}),
            React.createElement(TextElement, {path: pathWith('WordPoints'), show: IsCorrect}, Points(TheWord) + ' points added'),
    ),
        React.createElement(Calculation, {path: pathWith('IsCorrect'), show: false}),
        React.createElement(Button, {path: pathWith('StartWord'), content: 'Start Word', appearance: 'outline', show: Not(Answering), action: StartWord_action}),
        React.createElement(Button, {path: pathWith('GiveUp'), content: 'Give Up', appearance: 'outline', show: Answering, action: GiveUp_action}),
    )
}

// appMain.js
export default function MainApp(props) {
    const pathWith = name => 'MainApp' + '.' + name
    const {App} = Elemento.components
    const pages = {MainPage}
    const appContext = Elemento.useGetAppContext()

    const _state = Elemento.useGetStore()
    const app = _state.setObject('MainApp', new App.State({pages, appContext}))

    return React.createElement(App, {path: 'MainApp', },)
}
