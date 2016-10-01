describe('parseFunctionAgentData tests', () => {
  const functionAgentData = {
    body: 'body',
    params: 'params'
  }
  const builtInArguments = {
    this: {},
    arguments: {}
  }
  const calledArguments = ['arg1', 'arg2', 'arg3']
  // stub results
  const globalEnvironment = 'globalEnvironment'
  const functionEnvironment = 'functionEnvironment'
  let FlowState

  before(() => {
    FlowState = require('../../../../lib/EsprimaParser/structures/FlowState')
  })

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'getEnvironment')
      .withArgs(esprimaParser).returns(globalEnvironment)
      .withArgs(functionAgentData).returns(functionEnvironment)
    sandbox.stub(esprimaParser, 'setEnvironment')
    sandbox.stub(esprimaParser, 'setFunctionClosure')
    sandbox.stub(esprimaParser, 'flagHoisting', {
      set: sandbox.spy()
    })
    sandbox.stub(esprimaParser, 'parseNode')
    sandbox.stub(esprimaParser, 'flowState', {
      unset: sandbox.spy()
    })
  })

  it('should call getEnvironment with esprimaParser', () => {
    esprimaParser.parseFunctionAgentData(functionAgentData, builtInArguments, calledArguments)

    expect(
      esprimaParser.getEnvironment
        .calledWithExactly(esprimaParser)
    ).to.be.true
  })

  it('should call getEnvironment with functionAgentData', () => {
    esprimaParser.parseFunctionAgentData(functionAgentData, builtInArguments, calledArguments)

    expect(
      esprimaParser.getEnvironment
        .calledWithExactly(functionAgentData)
    ).to.be.true
  })

  it('should call setEnvironment with esprimaParser and functionEnvironment after getEnvironment with esprimaParser', () => {
    esprimaParser.parseFunctionAgentData(functionAgentData, builtInArguments, calledArguments)

    expect(
      esprimaParser.setEnvironment
        .calledWithExactly(esprimaParser, functionEnvironment)
    ).to.be.true
    expect(
      esprimaParser.setEnvironment
        .withArgs(esprimaParser, functionEnvironment)
          .calledAfter(esprimaParser.getEnvironment.withArgs(esprimaParser))
    ).to.be.true
  })

  it('should call setFunctionClosure with builtInArguments and an object containing keys (params) and values (calledArguments) after setEnvironment called with functionEnvironment', () => {
    esprimaParser.parseFunctionAgentData(functionAgentData, builtInArguments, calledArguments)

    expect(
      esprimaParser.setFunctionClosure
        .calledWithExactly(builtInArguments, {
          keys: functionAgentData.params,
          values: calledArguments
        })
    ).to.be.true
    expect(
      esprimaParser.setFunctionClosure
        .calledAfter(esprimaParser.setEnvironment.withArgs(esprimaParser, functionEnvironment))
    ).to.be.true
  })

  it('should call flagHoisting.set before parseNode', () => {
    esprimaParser.parseFunctionAgentData(functionAgentData, builtInArguments, calledArguments)

    expect(esprimaParser.flagHoisting.set.called).to.be.true
    expect(
      esprimaParser.flagHoisting.set
        .calledBefore(esprimaParser.parseNode)
    ).to.be.true
  })

  it('should call parseNode with functionAgentData body after setFunctionClosure called', () => {
    esprimaParser.parseFunctionAgentData(functionAgentData, builtInArguments, calledArguments)

    expect(
      esprimaParser.parseNode
        .calledWithExactly(functionAgentData.body)
    ).to.be.true
    expect(
      esprimaParser.parseNode
        .calledAfter(esprimaParser.setFunctionClosure)
    ).to.be.true
  })

  it('should call setEnvironment with esprimaParser and globalEnvironment after parseNode called', () => {
    esprimaParser.parseFunctionAgentData(functionAgentData, builtInArguments, calledArguments)

    expect(
      esprimaParser.setEnvironment
        .calledWithExactly(esprimaParser, globalEnvironment)
    ).to.be.true
    expect(
      esprimaParser.setEnvironment
        .withArgs(esprimaParser, globalEnvironment)
          .calledAfter(esprimaParser.parseNode)
    ).to.be.true
  })

  it('should call unset of flowState with FlowState.RETURN after parseNode called', () => {
    esprimaParser.parseFunctionAgentData(functionAgentData, builtInArguments, calledArguments)

    expect(
      esprimaParser.flowState.unset
        .calledWithExactly(FlowState.RETURN)
    ).to.be.true
    expect(
      esprimaParser.flowState.unset
        .calledAfter(esprimaParser.parseNode)
    ).to.be.true
  })

  it('should return result from parseNode', () => {
    const resultFromParseNode = 'resultFromParseNode'

    esprimaParser.parseNode.returns(resultFromParseNode)

    const result = esprimaParser.parseFunctionAgentData(functionAgentData, builtInArguments, calledArguments)

    expect(result).to.be.equal(resultFromParseNode)
  })

  it('should call setEnvironment with esprimaParser and globalEnvironment given parseNode called with functionAgentData.body throw error', () => {
    const error = new Error()

    esprimaParser.parseNode.throws(error)

    try {
      esprimaParser.parseFunctionAgentData(functionAgentData, builtInArguments, calledArguments)
    } catch (e) {
      expect(e).to.be.equal(error)
    }
    expect(
      esprimaParser.setEnvironment
        .calledWithExactly(esprimaParser, globalEnvironment)
    ).to.be.true
  })
})
