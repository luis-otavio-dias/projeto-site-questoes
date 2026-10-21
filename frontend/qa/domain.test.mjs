import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AxiosError } from 'axios';
import { getMetrics, resultOf } from '../src/features/questio/types.ts';
import { isSessionFailure } from '../src/services/api.ts';
test('aproveitamento do treino exclui respostas sem gabarito e não conferidas', () => {
  const exam = { id: '7', questions: [{ id: '1' }, { id: '2' }, { id: '3' }] };
  const metrics = getMetrics(exam, { '7::1': { checked: true, correct: true }, '7::2': { checked: true, correct: null }, '7::3': { checked: false, correct: null } });
  assert.deepEqual(metrics, { total: 3, answered: 2, scored: 1, correct: 1, next: '3' });
});
test('resultado separa erro, resposta ausente e resposta sem correção', () => {
  const sim = { questions: [{ key: 'a', correct: 'A' }, { key: 'b', correct: 'B' }, { key: 'c', correct: null }, { key: 'd', correct: 'A' }], responses: { a: 'A', b: 'A', c: 'B' } };
  const result = resultOf(sim);
  assert.equal(result.correct, 1); assert.equal(result.scored, 2); assert.equal(result.errors, 1); assert.equal(result.unanswered, 1); assert.equal(result.unscored, 1);
});
test('cópia da tentativa preserva o gabarito após alteração do material', () => {
  const question = { key: '1', correct: 'A' };
  const sim = { questions: structuredClone([question]), responses: { '1': 'A' } };
  question.correct = 'B'; assert.equal(resultOf(sim).correct, 1);
});
test('renovação reconhece 401 e 403 de autenticação por cookies', () => {
  const failure = (status, detail) => new AxiosError('Request failed', undefined, undefined, undefined, { status, data: { detail } });
  assert.equal(isSessionFailure(failure(401, 'expired')), true);
  assert.equal(isSessionFailure(failure(403, 'Invalid authentication token')), true);
  assert.equal(isSessionFailure(failure(403, 'Authentication credentials were not provided.')), true);
});
test('negação de permissão e erro de rede não são sessão expirada', () => {
  assert.equal(isSessionFailure(new AxiosError('Forbidden', undefined, undefined, undefined, { status: 403, data: { detail: 'You do not have permission to perform this action.' } })), false);
  assert.equal(isSessionFailure(new AxiosError('Network Error')), false);
});
