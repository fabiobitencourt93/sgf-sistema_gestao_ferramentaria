import React, { useState } from 'react';
import { useFerramentaria } from '../context/FerramentariaContext';
import { Plus, Image as ImageIcon, Calendar, FileText, X, Maximize2, Edit2, Trash2 } from 'lucide-react';

export default function Projetos() {
  // Importámos as novas funções do contexto
  const { maquinas, projetos, adicionarProjeto, editarProjeto, removerProjeto } = useFerramentaria();
  
  const [nome, setNome] = useState('');
  const [deadline, setDeadline] = useState('');
  const [arquivoDesenho, setArquivoDesenho] = useState(null);
  const [roteiro, setRoteiro] = useState([]);
  
  const [modalDesenho, setModalDesenho] = useState({ isOpen: false, url: '', tipo: '', nome: '' });
  
  // Novo Estado: Guarda o ID do projeto que está a ser editado
  const [idEmEdicao, setIdEmEdicao] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArquivoDesenho({
        url: URL.createObjectURL(file),
        tipo: file.type,
        nome: file.name
      });
    }
  };

  const addEtapaRoteiro = () => {
    setRoteiro([...roteiro, { id: Date.now(), maquinaId: '', operacao: '', tempo: '' }]);
  };

  const updateEtapa = (id, campo, valor) => {
    setRoteiro(roteiro.map(etapa => etapa.id === id ? { ...etapa, [campo]: valor } : etapa));
  };

  const removeEtapaRoteiro = (id) => {
    setRoteiro(roteiro.filter(etapa => etapa.id !== id));
  };

  // Carrega os dados da OS para o formulário
  const iniciarEdicao = (projeto) => {
    setNome(projeto.nome);
    setDeadline(projeto.deadline);
    setArquivoDesenho(projeto.desenho);
    setRoteiro([...projeto.roteiro]);
    setIdEmEdicao(projeto.id);
    
    // Faz scroll automático para o topo (formulário)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicao = () => {
    setNome(''); setDeadline(''); setArquivoDesenho(null); setRoteiro([]); setIdEmEdicao(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome || !deadline || roteiro.length === 0) {
      return alert('Preencha o nome, deadline e adicione pelo menos uma operação no roteiro.');
    }
    
    const dadosProjeto = { nome, deadline, desenho: arquivoDesenho, roteiro, status: 'Na Fila' };

    if (idEmEdicao) {
      editarProjeto(idEmEdicao, dadosProjeto);
    } else {
      adicionarProjeto(dadosProjeto);
    }
    
    cancelarEdicao();
  };

  const openViewer = (desenho, nomeProjeto) => {
    if (desenho) {
      setModalDesenho({
        isOpen: true,
        url: desenho.url,
        tipo: desenho.tipo,
        nome: `Desenho Técnico - ${nomeProjeto} (${desenho.nome})`
      });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex justify-between items-end border-b border-gray-200 dark:border-gray-800 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
          Gestão de Ordens de Fabricação
        </h1>
        {idEmEdicao && (
          <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
            Modo de Edição (OS#{idEmEdicao.toString().slice(-4)})
          </span>
        )}
      </div>
      
      {/* Formulário OS */}
      <form onSubmit={handleSubmit} className={`bg-white dark:bg-gray-900 border ${idEmEdicao ? 'border-amber-400 dark:border-amber-600 shadow-amber-500/10' : 'border-gray-200 dark:border-gray-800'} p-6 rounded-xl shadow-lg space-y-6 transition-colors duration-300`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Descrição / Conjunto (OS)</label>
              <input type="text" value={nome} onChange={e => setNome(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded p-2 text-gray-900 dark:text-white transition-colors duration-300" placeholder="Ex: Matriz de Repuxo..." />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Deadline (Prazo de Entrega)</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 text-gray-500" size={18} />
                <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded p-2 pl-10 text-gray-900 dark:text-white transition-colors duration-300" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Desenho Técnico (PDF ou Imagem)</label>
              <input type="file" accept="image/*,application/pdf" onChange={handleFileUpload} className="block w-full text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-100 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-200 dark:hover:file:bg-blue-800 cursor-pointer" />
              
              {arquivoDesenho && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-950 rounded border border-gray-300 dark:border-gray-700 h-32 flex flex-col items-center justify-center overflow-hidden relative group cursor-pointer transition-colors duration-300" onClick={() => openViewer(arquivoDesenho, nome || 'Novo Projeto')}>
                  {arquivoDesenho.tipo === 'application/pdf' ? <FileText size={40} className="text-red-500 mb-2" /> : <img src={arquivoDesenho.url} alt="Preview" className="object-cover h-full w-full opacity-60" />}
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="flex items-center gap-2 text-white font-semibold"><Maximize2 size={18} /> Ampliar</span>
                  </div>
                  {arquivoDesenho.tipo === 'application/pdf' && <span className="text-xs text-gray-600 dark:text-gray-400 text-center truncate w-full">{arquivoDesenho.nome}</span>}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2 transition-colors duration-300">
              <span className="font-semibold text-gray-800 dark:text-gray-300">Roteiro de Processos</span>
              <button type="button" onClick={addEtapaRoteiro} className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 px-3 py-1 rounded transition-colors text-blue-600 dark:text-blue-400 border border-gray-200 dark:border-transparent">
                <Plus size={16} /> Adicionar Etapa
              </button>
            </div>
            
            <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
              {roteiro.map((etapa, index) => (
                <div key={etapa.id} className="bg-gray-50 dark:bg-gray-950 p-3 rounded border border-gray-300 dark:border-gray-800 flex flex-col gap-2 transition-colors duration-300 relative group">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-blue-600 dark:text-blue-500 font-bold uppercase tracking-wider">Operação {index + 1}</span>
                    <button type="button" onClick={() => removeEtapaRoteiro(etapa.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                  <select value={etapa.maquinaId} onChange={(e) => updateEtapa(etapa.id, 'maquinaId', e.target.value)} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded p-1.5 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    <option value="">Selecione a Máquina...</option>
                    {maquinas.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
                  </select>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Operação" value={etapa.operacao} onChange={(e) => updateEtapa(etapa.id, 'operacao', e.target.value)} className="w-2/3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded p-1.5 text-sm text-gray-900 dark:text-white transition-colors duration-300" />
                    <input type="number" placeholder="Horas" value={etapa.tempo} onChange={(e) => updateEtapa(etapa.id, 'tempo', e.target.value)} className="w-1/3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded p-1.5 text-sm text-gray-900 dark:text-white transition-colors duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
          {idEmEdicao && (
            <button type="button" onClick={cancelarEdicao} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium px-4 py-2 transition-colors">
              Cancelar Edição
            </button>
          )}
          <button type="submit" className={`font-bold py-2 px-6 rounded-lg transition-colors text-white ${idEmEdicao ? 'bg-amber-600 hover:bg-amber-500' : 'bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500'}`}>
            {idEmEdicao ? 'Guardar Alterações' : 'Emitir Ordem de Fabricação'}
          </button>
        </div>
      </form>

      {/* Lista de Ordens */}
      <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-800 dark:text-gray-300 transition-colors duration-300">Ordens de Serviço em Fábrica</h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {projetos.map(proj => (
          <div key={proj.id} className="bg-white dark:bg-gray-900 border-l-4 border-blue-500 p-5 rounded-xl shadow-lg border border-gray-200 dark:border-transparent flex gap-4 transition-colors duration-300 relative group">
            
            {/* Ações (Editar / Apagar) */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => iniciarEdicao(proj)} className="p-1.5 bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-gray-700 transition-colors" title="Editar OS">
                <Edit2 size={16} />
              </button>
              <button onClick={() => removerProjeto(proj.id)} className="p-1.5 bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-gray-700 transition-colors" title="Apagar OS">
                <Trash2 size={16} />
              </button>
            </div>

            <div className="w-28 h-28 shrink-0 rounded-lg bg-gray-50 dark:bg-gray-950 border border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors relative overflow-hidden" onClick={() => openViewer(proj.desenho, proj.nome)}>
              {proj.desenho ? (
                <>
                  {proj.desenho.tipo === 'application/pdf' ? <FileText size={40} className="text-red-500" /> : <img src={proj.desenho.url} alt="Desenho" className="w-full h-full object-cover opacity-70 hover:opacity-30 transition-opacity" />}
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50">
                    <Maximize2 size={24} className="text-white mb-1" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Ampliar</span>
                  </div>
                </>
              ) : (
                <div className="text-gray-400 dark:text-gray-700 flex flex-col items-center"><ImageIcon size={32} /><span className="text-[10px] mt-2 text-gray-500">Sem Anexo</span></div>
              )}
            </div>

            <div className="flex-1 pr-16">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{proj.nome}</h3>
              </div>
              <span className="inline-block mb-2 bg-blue-50 dark:bg-gray-800 text-xs px-2 py-1 rounded text-blue-700 dark:text-blue-400 font-mono font-semibold border border-blue-100 dark:border-transparent">
                OS#{proj.id.toString().slice(-4)}
              </span>
              <p className="text-sm text-red-600 dark:text-red-400 font-semibold mb-2">Entrega: {new Date(proj.deadline).toLocaleDateString()}</p>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <span className="block font-semibold text-gray-700 dark:text-gray-500 border-b border-gray-200 dark:border-gray-800 pb-1 mb-1">Roteiro Planejado:</span>
                {proj.roteiro.map((etapa, idx) => {
                  const maq = maquinas.find(m => m.id === parseInt(etapa.maquinaId));
                  return (
                    <span key={idx} className="block">
                      {etapa.operacao} ({etapa.tempo}h) - <span className="text-gray-800 dark:text-gray-300 font-medium">{maq?.nome}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Viewer */}
      {modalDesenho.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-t-xl transition-colors duration-300">
              <div className="flex items-center gap-3">
                {modalDesenho.tipo === 'application/pdf' ? <FileText className="text-red-500" /> : <ImageIcon className="text-blue-600 dark:text-blue-500" />}
                <h3 className="text-gray-900 dark:text-white font-bold text-lg">{modalDesenho.nome}</h3>
              </div>
              <button onClick={() => setModalDesenho({ isOpen: false, url: '', tipo: '', nome: '' })} className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-lg transition-all">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 bg-gray-100 dark:bg-[#2d2d2d] rounded-b-xl overflow-hidden relative transition-colors duration-300">
              {modalDesenho.tipo === 'application/pdf' ? (
                <iframe src={modalDesenho.url} className="w-full h-full border-0" title="Visualizador" />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-4 overflow-auto">
                  <img src={modalDesenho.url} alt="Expandido" className="max-w-full max-h-full object-contain shadow-2xl border border-gray-300 dark:border-gray-800 rounded" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}