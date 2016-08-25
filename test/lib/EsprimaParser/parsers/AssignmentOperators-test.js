// spec: https://github.com/estree/estree/blob/master/spec.md#assignmentoperator

describe('AssignmentOperators tests', () => {
  const target = {
    object: 'object',
    property: 'property',
    info: {}
  }
  const value = 'value'
  // stub results
  const contextStub = 'contextStub'
  const statusStub = {}

  beforeEach(() => {
    sandbox.stub(esprimaParser, 'context', contextStub)
    sandbox.stub(esprimaParser, 'callChecker', {
      dispatch: sandbox.stub().returns(statusStub)
    })
    sandbox.stub(esprimaParser, 'handleAssignManipulation')
    sandbox.stub(esprimaParser, 'handleAssignOperation')
  })

  it('should call dispatch of callChecker with an object containing context, caller (object) and callee (property)', () => {
    esprimaParser.assignmentOperators['='](target, value)

    expect(
      esprimaParser.callChecker.dispatch
        .calledWithExactly({
          caller: target.object,
          callee: target.property,
          context: esprimaParser.context
        })
    ).to.be.true
  })

  it('should call handleAssignManipulation with object, property, status and info given non-undefined status', () => {
    esprimaParser.assignmentOperators['='](target, value)

    expect(
      esprimaParser.handleAssignManipulation
        .calledWithExactly(target.object, target.property, target.info, value, statusStub)
    ).to.be.true
  })

  it('should call handleAssignOperation with object, property and value given undefined status', () => {
    esprimaParser.callChecker.dispatch.returns(undefined)

    esprimaParser.assignmentOperators['='](target, value)

    expect(
      esprimaParser.handleAssignOperation
        .calledWithExactly(target.object, target.property, value)
    ).to.be.true
  })
})
