import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createMealPlan } from '../../features/mealPlanning/mealPlanningSlice';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Plus, Trash2, ChevronRight, ChevronLeft, Check,
  Utensils, Clock, Users, Flame, Image, Tag, Leaf, BookOpen,
} from 'lucide-react';

// ─── Config ───────────────────────────────────────────────────────────────────
const CUISINE_TYPES   = ['Italian','Indian','Mexican','Chinese','Japanese','Thai','American','French','Mediterranean', 'West African','Other'];
const DIFFICULTY      = ['Easy','Medium','Hard'];
const DIETARY_OPTIONS = ['Vegan','Vegetarian','Gluten-Free','Dairy-Free','Nut-Free','Halal','Kosher'];
const UNITS           = ['g','kg','ml','l','cup','tbsp','tsp','pcs','oz','lb'];

const DIFF_COLORS = {
  Easy:   'bg-emerald-500 text-white border-emerald-500',
  Medium: 'bg-amber-500 text-white border-amber-500',
  Hard:   'bg-red-500 text-white border-red-500',
};
const DIFF_OUTLINE = {
  Easy:   'bg-white text-emerald-600 border-emerald-300 hover:border-emerald-500',
  Medium: 'bg-white text-amber-600 border-amber-300 hover:border-amber-500',
  Hard:   'bg-white text-red-600 border-red-300 hover:border-red-500',
};

// ─── Steps config ─────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Basics',      icon: BookOpen  },
  { id: 2, label: 'Ingredients', icon: Utensils  },
  { id: 3, label: 'Instructions',icon: Flame     },
  { id: 4, label: 'Extras',      icon: Tag       },
];

// ─── Reusable input styles ────────────────────────────────────────────────────
const inputCls = 'w-full px-4 py-3 rounded-2xl bg-white/60 border border-gray-200/80 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3a5d8f]/20 focus:border-[#3a5d8f]/50 transition-all';
const labelCls = 'block text-xs font-black text-gray-500 uppercase tracking-widest mb-1.5';

// ─── Step indicator ───────────────────────────────────────────────────────────
const StepBar = ({ current }) => (
  <div className="flex items-center justify-center gap-2 px-6 py-4 border-b border-gray-100">
    {STEPS.map((step, i) => {
      const done    = current > step.id;
      const active  = current === step.id;
      const Icon    = step.icon;
      return (
        <div key={step.id} className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all
            ${active  ? 'bg-gradient-to-r from-[#3a5d8f] to-emerald-500 text-white shadow-md shadow-[#3a5d8f]/20' :
              done    ? 'bg-emerald-100 text-emerald-700' :
                        'bg-gray-100 text-gray-400'}`}>
            {done
              ? <Check className="w-3 h-3" />
              : <Icon className="w-3 h-3" />
            }
            <span className="hidden sm:inline">{step.label}</span>
            <span className="sm:hidden">{step.id}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-6 h-px ${current > step.id ? 'bg-emerald-300' : 'bg-gray-200'}`} />
          )}
        </div>
      );
    })}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const CreateRecipeModal = ({ isOpen, onClose, initialData = null, isEditing = false, onSave = null }) => {
  const dispatch   = useDispatch();
  const { user }   = useSelector((s) => s.auth);
  const { isLoading } = useSelector((s) => s.mealPlanning);

  const [step, setStep] = useState(1);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    recipeName: '', description: '', cuisineType: '', preparationTime: '',
    cookingTime: '', servingSize: '', difficultyLevel: '',
    ingredients: [{ name: '', quantity: '', unit: 'g' }],
    instructions: '', tags: [], recipeImage: null, dietaryRestrictions: [], rating: 5,
  });

  // Pre-fill when editing
  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData, recipeImage: null });
      setPreviewImage(initialData.recipeImage || null);
    }
  }, [initialData]);

  // Reset when modal opens fresh
  useEffect(() => {
    if (isOpen && !initialData) {
      setStep(1);
      setPreviewImage(null);
      setFormData({
        recipeName: '', description: '', cuisineType: '', preparationTime: '',
        cookingTime: '', servingSize: '', difficultyLevel: '',
        ingredients: [{ name: '', quantity: '', unit: 'g' }],
        instructions: '', tags: [], recipeImage: null, dietaryRestrictions: [], rating: 5,
      });
    }
  }, [isOpen]);

  const set = (field, value) => setFormData(p => ({ ...p, [field]: value }));
  const onInput = (e) => set(e.target.name, e.target.value);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) { set('recipeImage', file); setPreviewImage(URL.createObjectURL(file)); }
  };

  const updateIngredient = (i, field, val) => {
    const updated = [...formData.ingredients];
    updated[i][field] = val;
    set('ingredients', updated);
  };

  const addIngredient    = () => set('ingredients', [...formData.ingredients, { name: '', quantity: '', unit: 'g' }]);
  const removeIngredient = (i) => set('ingredients', formData.ingredients.filter((_, idx) => idx !== i));

  const toggleDietary = (d) => set('dietaryRestrictions',
    formData.dietaryRestrictions.includes(d)
      ? formData.dietaryRestrictions.filter(r => r !== d)
      : [...formData.dietaryRestrictions, d]
  );

  // Validate current step before going forward
  const canProceed = () => {
    if (step === 1) return formData.recipeName && formData.description && formData.cuisineType && formData.difficultyLevel && formData.preparationTime && formData.cookingTime && formData.servingSize;
    if (step === 2) return formData.ingredients.every(i => i.name && i.quantity && i.unit);
    if (step === 3) return formData.instructions.trim().length > 10;
    return true;
  };

  const handleNext = () => { if (canProceed()) setStep(s => s + 1); else toast.error('Please fill in all required fields'); };
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    if (!user?.isApproved) { toast.error('Account needs approval before creating recipes'); return; }
    if (!formData.recipeImage && !isEditing) { toast.error('Please upload a recipe image'); return; }

    try {
      if (isEditing) {
        await onSave(formData);
      } else {
        await dispatch(createMealPlan(formData)).unwrap();
        toast.success('Recipe created! 🎉');
      }
      onClose();
    } catch (err) {
      toast.error(err || `Failed to ${isEditing ? 'update' : 'create'} recipe`);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose} />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: 'spring', bounce: 0.18, duration: 0.4 }}
            className="fixed inset-x-3 top-[3%] bottom-[3%] md:inset-x-auto md:w-[700px] md:top-[5%] md:bottom-[5%] md:left-1/2 md:-translate-x-1/2 bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative h-24 flex-shrink-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-[#3a5d8f] to-emerald-500" />
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <div className="absolute inset-0 flex items-center justify-between px-6">
                <div>
                  <p className="text-white/70 text-[11px] font-bold uppercase tracking-widest mb-0.5">
                    {isEditing ? 'Editing Recipe' : 'New Recipe'} · Step {step} of {STEPS.length}
                  </p>
                  <h2 className="text-white text-xl font-black">
                    {isEditing ? 'Update Your Recipe' : 'Create a Recipe'}
                  </h2>
                </div>
                <button onClick={onClose}
                  className="w-9 h-9 bg-white/20 hover:bg-white/35 text-white rounded-full flex items-center justify-center transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Step bar */}
            <StepBar current={step} />

            {/* Form content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <AnimatePresence mode="wait">

                {/* ── Step 1: Basics ── */}
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <p className="text-xs text-gray-400 font-medium mb-1">Tell us about your recipe</p>

                    <div>
                      <label className={labelCls}>Recipe Name *</label>
                      <input type="text" name="recipeName" value={formData.recipeName}
                        onChange={onInput} placeholder="e.g. Spicy Jollof Rice"
                        className={inputCls} />
                    </div>

                    <div>
                      <label className={labelCls}>Description *</label>
                      <textarea name="description" value={formData.description}
                        onChange={onInput} rows={3} placeholder="Describe the flavours, origin, and what makes it special…"
                        className={`${inputCls} resize-none`} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Cuisine *</label>
                        <select name="cuisineType" value={formData.cuisineType} onChange={onInput} className={inputCls}>
                          <option value="">Select cuisine</option>
                          {CUISINE_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Difficulty *</label>
                        <div className="flex gap-2">
                          {DIFFICULTY.map(d => (
                            <button key={d} type="button" onClick={() => set('difficultyLevel', d)}
                              className={`flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition-all
                                ${formData.difficultyLevel === d ? DIFF_COLORS[d] : DIFF_OUTLINE[d]}`}>
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { name: 'preparationTime', label: 'Prep Time', placeholder: 'mins', icon: Clock  },
                        { name: 'cookingTime',      label: 'Cook Time', placeholder: 'mins', icon: Flame  },
                        { name: 'servingSize',       label: 'Servings',  placeholder: 'ppl',  icon: Users  },
                      ].map(({ name, label, placeholder, icon: Icon }) => (
                        <div key={name}>
                          <label className={labelCls}>
                            <Icon className="w-3 h-3 inline mr-1 -mt-0.5" />{label} *
                          </label>
                          <input type="number" name={name} value={formData[name]}
                            onChange={onInput} min="0" placeholder={placeholder}
                            className={inputCls} />
                        </div>
                      ))}
                    </div>

                    {/* Image upload on step 1 */}
                    <div>
                      <label className={labelCls}><Image className="w-3 h-3 inline mr-1 -mt-0.5" />Recipe Image {!isEditing && '*'}</label>
                      <label className="flex flex-col items-center justify-center w-full h-36 rounded-2xl border-2 border-dashed border-[#3a5d8f]/25 hover:border-[#3a5d8f]/60 bg-[#3a5d8f]/3 hover:bg-[#3a5d8f]/6 cursor-pointer transition-all overflow-hidden relative">
                        {previewImage ? (
                          <>
                            <img src={previewImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl">
                              <span className="text-white text-xs font-bold bg-black/40 px-3 py-1.5 rounded-full">Click to change</span>
                            </div>
                          </>
                        ) : (
                          <div className="text-center">
                            <Image className="w-8 h-8 text-[#3a5d8f]/40 mx-auto mb-2" />
                            <p className="text-sm font-semibold text-gray-500">Click to upload image</p>
                            <p className="text-xs text-gray-400 mt-0.5">PNG, JPG up to 10MB</p>
                          </div>
                        )}
                        <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                      </label>
                    </div>
                  </motion.div>
                )}

                {/* ── Step 2: Ingredients ── */}
                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                    <p className="text-xs text-gray-400 font-medium">Add all ingredients with their quantities</p>

                    <div className="space-y-2">
                      {formData.ingredients.map((ing, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 p-3 bg-gray-50/70 rounded-2xl border border-gray-100">
                          {/* Number */}
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#3a5d8f] to-emerald-500 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">
                            {i + 1}
                          </div>

                          {/* Name */}
                          <input type="text" placeholder="Ingredient name"
                            value={ing.name} onChange={e => updateIngredient(i, 'name', e.target.value)}
                            className="flex-1 px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3a5d8f]/20 focus:border-[#3a5d8f]/40 transition-all" />

                          {/* Quantity */}
                          <input type="number" placeholder="Qty" min="0" step="0.1"
                            value={ing.quantity} onChange={e => updateIngredient(i, 'quantity', e.target.value)}
                            className="w-16 px-2 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3a5d8f]/20 focus:border-[#3a5d8f]/40 transition-all text-center" />

                          {/* Unit */}
                          <select value={ing.unit} onChange={e => updateIngredient(i, 'unit', e.target.value)}
                            className="w-16 px-1 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3a5d8f]/20 transition-all">
                            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                          </select>

                          {/* Remove */}
                          {formData.ingredients.length > 1 && (
                            <button type="button" onClick={() => removeIngredient(i)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    <button type="button" onClick={addIngredient}
                      className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[#3a5d8f]/25 hover:border-[#3a5d8f]/60 text-[#3a5d8f] font-semibold text-sm rounded-2xl hover:bg-[#3a5d8f]/3 transition-all group">
                      <Plus className="w-4 h-4 group-hover:scale-125 transition-transform" />
                      Add Ingredient
                    </button>

                    <div className="bg-amber-50/80 rounded-2xl p-3 border border-amber-200/60">
                      <p className="text-xs text-amber-700 font-semibold">
                        💡 Tip — Be specific with quantities (e.g. 200g, 2 cups). This helps with the shopping list generator.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* ── Step 3: Instructions ── */}
                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <p className="text-xs text-gray-400 font-medium">Write clear step-by-step instructions</p>

                    <div className="bg-blue-50/80 rounded-2xl p-3 border border-blue-200/60">
                      <p className="text-xs text-[#3a5d8f] font-semibold">
                        💡 Tip — Write each step on a new line. They'll be numbered automatically on the recipe page.
                      </p>
                    </div>

                    <div>
                      <label className={labelCls}>
                        <Flame className="w-3 h-3 inline mr-1 -mt-0.5" />Instructions *
                      </label>
                      <textarea name="instructions" value={formData.instructions}
                        onChange={onInput} rows={12}
                        placeholder={`Clean and wash the chicken pieces\nSeason with salt, pepper and spices\nHeat oil in a large pot over medium heat\nAdd chicken and brown on all sides\nAdd tomatoes and simmer for 30 minutes`}
                        className={`${inputCls} resize-none font-mono text-[13px] leading-relaxed`} />
                      <p className="text-[10px] text-gray-400 mt-1.5">
                        {formData.instructions.split('\n').filter(s => s.trim()).length} steps written
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* ── Step 4: Extras ── */}
                {step === 4 && (
                  <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                    <p className="text-xs text-gray-400 font-medium">Optional — helps others discover your recipe</p>

                    {/* Tags */}
                    <div>
                      <label className={labelCls}><Tag className="w-3 h-3 inline mr-1 -mt-0.5" />Tags</label>
                      <input type="text" placeholder="e.g. healthy, quick, weeknight, family-friendly"
                        value={formData.tags.join(', ')}
                        onChange={e => set('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                        className={inputCls} />
                      <p className="text-[10px] text-gray-400 mt-1">Separate tags with commas</p>
                      {formData.tags.length > 0 && (
                        <div className="flex gap-1.5 flex-wrap mt-2">
                          {formData.tags.map(tag => (
                            <span key={tag} className="text-[11px] font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Dietary restrictions */}
                    <div>
                      <label className={labelCls}><Leaf className="w-3 h-3 inline mr-1 -mt-0.5" />Dietary Restrictions</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {DIETARY_OPTIONS.map(d => (
                          <button key={d} type="button" onClick={() => toggleDietary(d)}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold border-2 transition-all text-left
                              ${formData.dietaryRestrictions.includes(d)
                                ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400 hover:text-emerald-600'}`}>
                            {formData.dietaryRestrictions.includes(d)
                              ? <Check className="w-3 h-3 flex-shrink-0" />
                              : <div className="w-3 h-3 rounded-sm border border-current flex-shrink-0" />
                            }
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Summary card */}
                    <div className="bg-gradient-to-br from-[#3a5d8f]/5 to-emerald-500/5 rounded-2xl border border-[#3a5d8f]/10 p-4">
                      <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Recipe Summary</p>
                      <div className="space-y-2">
                        {[
                          { label: 'Name',       value: formData.recipeName    },
                          { label: 'Cuisine',    value: formData.cuisineType   },
                          { label: 'Difficulty', value: formData.difficultyLevel },
                          { label: 'Total time', value: `${(parseInt(formData.preparationTime)||0) + (parseInt(formData.cookingTime)||0)} min` },
                          { label: 'Servings',   value: formData.servingSize   },
                          { label: 'Ingredients', value: `${formData.ingredients.filter(i=>i.name).length} items` },
                        ].map(({ label, value }) => (
                          <div key={label} className="flex items-center justify-between text-sm">
                            <span className="text-gray-400 text-xs font-semibold">{label}</span>
                            <span className="font-bold text-gray-800 text-xs">{value || '—'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Footer navigation */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3 flex-shrink-0 bg-gray-50/50">
              <button type="button" onClick={step === 1 ? onClose : handleBack}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm hover:border-gray-300 hover:text-gray-800 transition-all">
                <ChevronLeft className="w-4 h-4" />
                {step === 1 ? 'Cancel' : 'Back'}
              </button>

              <div className="flex items-center gap-1.5">
                {STEPS.map(s => (
                  <div key={s.id} className={`h-1.5 rounded-full transition-all ${
                    s.id === step ? 'w-6 bg-[#3a5d8f]' :
                    s.id < step   ? 'w-3 bg-emerald-400' :
                                    'w-3 bg-gray-200'
                  }`} />
                ))}
              </div>

              {step < STEPS.length ? (
                <motion.button type="button" onClick={handleNext}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-[#3a5d8f] to-emerald-500 text-white font-bold rounded-xl text-sm shadow-md shadow-[#3a5d8f]/20 transition-all">
                  Next <ChevronRight className="w-4 h-4" />
                </motion.button>
              ) : (
                <motion.button type="button" onClick={handleSubmit} disabled={isLoading}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-[#3a5d8f] to-emerald-500 disabled:opacity-60 text-white font-bold rounded-xl text-sm shadow-md shadow-[#3a5d8f]/20 transition-all">
                  {isLoading
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
                    : <><Check className="w-4 h-4" /> {isEditing ? 'Update Recipe' : 'Create Recipe'}</>
                  }
                </motion.button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateRecipeModal;