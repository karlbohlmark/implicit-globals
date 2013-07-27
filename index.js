var astwalk = require('astw');

module.exports = globals

function globals (ast) {
	var walk = astwalk(ast)
	var glbls = []

	walk(annotateDeclarations)

	walk(function (node) {
		if (node.type != 'Identifier') return;
		if (parentDeclares(node.parent, node.name)) return;
		if (glbls.indexOf(node.name) != -1) return;
		
		glbls.push(node.name);
	})

	return glbls;
}

function annotateDeclarations (node) {
	switch (node.type) {
		case 'VariableDeclaration':
			return annotateVariableDeclaration(node);
			break;
		case 'FunctionDeclaration':
			return annotateFunctionDeclaration(node);
			break;
		case 'FunctionExpression':
			return annotateFunctionExpression(node);
			break;
		case 'ForStatement':
			return annotateForStatement(node);
			break;
		default:
			break;
	}
}

function annotateVariableDeclaration (node) {
	return node._declarations = node.declarations.map(function (declarator) {
		return declarator.id.name;
	})
}

function annotateFunctionExpression (node) {
	return node._declarations = node.params.map(function (param) {
		return param.name;
	}).concat([node.id.name])
}

var annotateFunctionDeclaration = annotateFunctionExpression

function annotateForStatement (node) {
	if (node.init.type == 'VariableDeclaration') {
		node._declarations = annotateVariableDeclaration(node.init)
	}
}

function parentDeclares (node, name) {
	if (node._declarations && node._declarations.indexOf(name)!=-1) {
		return true;
	}

	if (!node.parent) return false;

	return parentDeclares(node.parent, name) 
}