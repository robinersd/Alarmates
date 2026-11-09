/**
 * AlarmMates - Interactive 3D Animated Logo with 4-Sound FX Studio
 * 1. ⏰ Ring Alarm! (Twin Bells + Shockwave)
 * 2. ⚡ Elastic Pop (3D Squash & Jump)
 * 3. 🌀 360° Flip (Whoosh + Hero Spin)
 * 4. ✨ Brand Sting (Harmonic Logo Chord)
 * 3D Extrusion Relief Depth Slider (0.5x - 2.5x)
 * 100% Pure Transparent WebGL (Kyoto scene shines through)
 */

(function () {
  'use strict';

  // 1. EXACT VECTOR CONTOURS EXTRACTED FROM UPLOADED ALARMMATES ICON
  const LOGO_CONTOURS = {"squircle": [[3.6824, -1.9243], [3.6655, -2.0857], [3.6369, -2.245], [3.594, -2.4004], [3.5342, -2.5496], [3.4568, -2.6904], [3.3641, -2.8224], [3.26, -2.9467], [3.1481, -3.0644], [3.0292, -3.1747], [2.9025, -3.2756], [2.7677, -3.3649], [2.6252, -3.4402], [2.4755, -3.4979], [2.3198, -3.5361], [2.1599, -3.5571], [1.9978, -3.5675], [1.8351, -3.5733], [1.6721, -3.5779], [1.5092, -3.5822], [1.3462, -3.5866], [1.1832, -3.5909], [1.0203, -3.5953], [0.8573, -3.5997], [0.6944, -3.604], [0.5314, -3.6084], [0.3685, -3.6127], [0.2055, -3.6171], [0.0425, -3.6214], [-0.1204, -3.6258], [-0.2834, -3.6301], [-0.4463, -3.6345], [-0.6093, -3.6388], [-0.7722, -3.6432], [-0.9352, -3.6474], [-1.0981, -3.6506], [-1.2609, -3.6511], [-1.4236, -3.6463], [-1.586, -3.6359], [-1.7483, -3.6218], [-1.9104, -3.6058], [-2.0717, -3.5862], [-2.2308, -3.5579], [-2.3861, -3.5155], [-2.5368, -3.4579], [-2.6815, -3.3863], [-2.8192, -3.3017], [-2.9494, -3.2054], [-3.0709, -3.0988], [-3.182, -2.9817], [-3.2813, -2.8546], [-3.3693, -2.7189], [-3.4459, -2.5764], [-3.5092, -2.4277], [-3.5581, -2.2736], [-3.5938, -2.1156], [-3.6189, -1.9551], [-3.6359, -1.7933], [-3.6475, -1.6308], [-3.6563, -1.4681], [-3.6642, -1.3053], [-3.6719, -1.1424], [-3.6795, -0.9796], [-3.6868, -0.8167], [-3.693, -0.6539], [-3.6972, -0.491], [-3.6993, -0.328], [-3.6999, -0.165], [-3.7, -0.002], [-3.7, 0.161], [-3.7, 0.3241], [-3.7, 0.4871], [-3.7, 0.6501], [-3.7, 0.8131], [-3.6997, 0.9761], [-3.6984, 1.139], [-3.6938, 1.3018], [-3.6843, 1.4643], [-3.67, 1.6265], [-3.6528, 1.7886], [-3.6331, 1.9502], [-3.6079, 2.1108], [-3.5726, 2.2689], [-3.5241, 2.4233], [-3.4622, 2.5729], [-3.3877, 2.7167], [-3.3014, 2.8539], [-3.204, 2.9833], [-3.0957, 3.1033], [-2.9763, 3.2118], [-2.8464, 3.3079], [-2.7083, 3.3924], [-2.5635, 3.465], [-2.413, 3.5241], [-2.2575, 3.5687], [-2.0985, 3.5988], [-1.9372, 3.6163], [-1.7747, 3.6245], [-1.6119, 3.6281], [-1.4489, 3.6301], [-1.2859, 3.6318], [-1.1229, 3.6336], [-0.9598, 3.6353], [-0.7968, 3.637], [-0.6338, 3.6387], [-0.4708, 3.6404], [-0.3078, 3.6421], [-0.1448, 3.6438], [0.0182, 3.6455], [0.1812, 3.6473], [0.3442, 3.649], [0.5072, 3.6507], [0.6702, 3.6524], [0.8332, 3.6541], [0.9962, 3.6558], [1.1592, 3.6575], [1.3222, 3.6592], [1.4853, 3.6609], [1.6482, 3.6619], [1.8108, 3.6598], [1.9727, 3.6497], [2.133, 3.6272], [2.2909, 3.5914], [2.4454, 3.5426], [2.5957, 3.4818], [2.7409, 3.4097], [2.8799, 3.3265], [3.0115, 3.232], [3.1343, 3.1267], [3.2473, 3.011], [3.3494, 2.8857], [3.4393, 2.7516], [3.515, 2.6092], [3.5761, 2.4598], [3.6236, 2.3051], [3.6577, 2.1468], [3.6787, 1.9861], [3.6888, 1.824], [3.6923, 1.6612], [3.6931, 1.4982], [3.6932, 1.3352], [3.6932, 1.1722], [3.6932, 1.0092], [3.6932, 0.8462], [3.6932, 0.6832], [3.6932, 0.5201], [3.6932, 0.3571], [3.6932, 0.1941], [3.6932, 0.0311], [3.6932, -0.1319], [3.6932, -0.2949], [3.6932, -0.4579], [3.6932, -0.621], [3.6932, -0.784], [3.6932, -0.947], [3.6932, -1.11], [3.6932, -1.273], [3.6931, -1.436], [3.6927, -1.599], [3.6903, -1.7619]], "am_outer": [[-1.518, 1.3549], [-1.613, 1.3325], [-1.6992, 1.2912], [-1.7739, 1.2311], [-1.8348, 1.1563], [-1.8835, 1.0729], [-1.9246, 0.9856], [-1.9631, 0.8972], [-2.0014, 0.8087], [-2.04, 0.7203], [-2.0783, 0.6318], [-2.1161, 0.543], [-2.1537, 0.4542], [-2.1913, 0.3654], [-2.2288, 0.2766], [-2.2664, 0.1878], [-2.304, 0.099], [-2.3416, 0.0101], [-2.3791, -0.0787], [-2.4167, -0.1675], [-2.4543, -0.2563], [-2.4919, -0.3451], [-2.5294, -0.4339], [-2.567, -0.5228], [-2.6046, -0.6116], [-2.6422, -0.7004], [-2.6797, -0.7892], [-2.7173, -0.878], [-2.7549, -0.9668], [-2.7925, -1.0557], [-2.83, -1.1445], [-2.8676, -1.2333], [-2.9052, -1.3221], [-2.9425, -1.4111], [-2.9776, -1.5008], [-3.005, -1.5929], [-3.0159, -1.6878], [-3.0043, -1.7819], [-2.9681, -1.8688], [-2.9088, -1.9417], [-2.8313, -1.9955], [-2.7413, -2.028], [-2.6436, -2.0414], [-2.5437, -2.0394], [-2.4476, -2.0212], [-2.3609, -1.9827], [-2.2884, -1.9227], [-2.2323, -1.8461], [-2.1883, -1.7607], [-2.1503, -1.6722], [-2.1136, -1.583], [-2.0767, -1.494], [-2.0374, -1.4071], [-1.988, -1.3305], [-1.9181, -1.2782], [-1.8276, -1.2552], [-1.7263, -1.2498], [-1.6222, -1.2493], [-1.5179, -1.2493], [-1.4135, -1.2493], [-1.3091, -1.2493], [-1.2047, -1.2493], [-1.1006, -1.2497], [-0.999, -1.2544], [-0.908, -1.2751], [-0.8385, -1.3245], [-0.7922, -1.4004], [-0.7591, -1.4893], [-0.7299, -1.5814], [-0.7003, -1.6735], [-0.6672, -1.7641], [-0.6254, -1.8501], [-0.5686, -1.9255], [-0.4947, -1.9837], [-0.4073, -2.0213], [-0.3109, -2.0401], [-0.2092, -2.0466], [-0.1054, -2.0476], [-0.0019, -2.0459], [0.0992, -2.0379], [0.1943, -2.0168], [0.2786, -1.9763], [0.3443, -1.913], [0.3853, -1.8299], [0.4036, -1.7337], [0.4087, -1.6315], [0.4095, -1.5275], [0.4096, -1.4231], [0.4096, -1.3188], [0.4096, -1.2144], [0.4096, -1.11], [0.4096, -1.0056], [0.4096, -0.9012], [0.4098, -0.7969], [0.4117, -0.6945], [0.4213, -0.6059], [0.4468, -0.5606], [0.4879, -0.5805], [0.5339, -0.6471], [0.5786, -0.7306], [0.6219, -0.8169], [0.6655, -0.9032], [0.7097, -0.9893], [0.754, -1.0753], [0.7976, -1.1616], [0.8409, -1.2481], [0.886, -1.3336], [0.9373, -1.4146], [1.0013, -1.4829], [1.0816, -1.5293], [1.1743, -1.5512], [1.2714, -1.5505], [1.3641, -1.5273], [1.4455, -1.4808], [1.5129, -1.4143], [1.5684, -1.3355], [1.6181, -1.2521], [1.6665, -1.1678], [1.7155, -1.0837], [1.7649, -0.9998], [1.8145, -0.916], [1.864, -0.8321], [1.9135, -0.7483], [1.9629, -0.6659], [2.0125, -0.5963], [2.0589, -0.5679], [2.0915, -0.6027], [2.1058, -0.6852], [2.1091, -0.7859], [2.1094, -0.89], [2.1094, -0.9944], [2.1094, -1.0988], [2.1094, -1.2031], [2.1094, -1.3075], [2.1094, -1.4119], [2.1095, -1.5163], [2.1103, -1.6203], [2.1152, -1.7226], [2.1326, -1.8193], [2.172, -1.904], [2.236, -1.9699], [2.3193, -2.0123], [2.4146, -2.0329], [2.5161, -2.0397], [2.6196, -2.0402], [2.7219, -2.0353], [2.8188, -2.0179], [2.9044, -1.9793], [2.9714, -1.9168], [3.0133, -1.8341], [3.0318, -1.7382], [3.0369, -1.636], [3.0378, -1.532], [3.0378, -1.4276], [3.0378, -1.3232], [3.0378, -1.2188], [3.0378, -1.1145], [3.0378, -1.0101], [3.0378, -0.9057], [3.0378, -0.8013], [3.0378, -0.6969], [3.0378, -0.5926], [3.0378, -0.4882], [3.0378, -0.3838], [3.0378, -0.2794], [3.0378, -0.175], [3.0378, -0.0706], [3.0378, 0.0337], [3.0378, 0.1381], [3.0378, 0.2425], [3.0378, 0.3469], [3.0378, 0.4513], [3.0377, 0.5556], [3.0364, 0.6594], [3.0295, 0.7609], [3.0087, 0.8562], [2.9662, 0.9398], [2.9009, 1.0057], [2.8177, 1.0489], [2.7226, 1.0701], [2.6212, 1.0772], [2.5173, 1.0784], [2.4133, 1.0779], [2.3105, 1.0741], [2.2111, 1.0621], [2.1184, 1.0349], [2.0363, 0.9875], [1.9677, 0.9207], [1.9118, 0.8415], [1.8633, 0.7575], [1.8174, 0.6721], [1.7723, 0.5864], [1.7268, 0.5008], [1.6817, 0.4151], [1.6376, 0.329], [1.5935, 0.2429], [1.5487, 0.1571], [1.5035, 0.0714], [1.4586, -0.0144], [1.414, -0.1003], [1.3691, -0.1859], [1.3223, -0.2678], [1.2699, -0.3319], [1.2122, -0.3517], [1.1577, -0.3147], [1.1113, -0.2407], [1.0697, -0.1548], [1.0293, -0.0672], [0.9883, 0.0202], [0.9472, 0.1076], [0.9068, 0.1952], [0.8663, 0.2828], [0.8254, 0.3702], [0.7843, 0.4576], [0.7429, 0.5448], [0.7008, 0.6318], [0.6583, 0.7186], [0.6143, 0.8046], [0.565, 0.8874], [0.5041, 0.9606], [0.4279, 1.016], [0.3383, 1.0487], [0.2394, 1.0617], [0.1363, 1.0644], [0.0331, 1.0622], [-0.0665, 1.0508], [-0.1574, 1.021], [-0.2339, 0.968], [-0.2905, 0.8941], [-0.3251, 0.8055], [-0.3415, 0.708], [-0.347, 0.6059], [-0.3481, 0.502], [-0.3482, 0.3981], [-0.3481, 0.2951], [-0.3477, 0.193], [-0.3471, 0.0923], [-0.3508, 0.0038], [-0.3668, -0.0429], [-0.3958, -0.0234], [-0.4282, 0.0462], [-0.4593, 0.1345], [-0.4898, 0.226], [-0.5203, 0.3178], [-0.5509, 0.4095], [-0.5814, 0.5012], [-0.612, 0.593], [-0.6425, 0.6847], [-0.6731, 0.7764], [-0.7037, 0.8681], [-0.7348, 0.9596], [-0.7686, 1.05], [-0.8099, 1.1368], [-0.8644, 1.2155], [-0.9342, 1.2799], [-1.0177, 1.3247], [-1.1112, 1.35], [-1.2109, 1.3611], [-1.3138, 1.3644], [-1.4171, 1.3633]], "a_hole": [[-1.3506, 0.293], [-1.3179, 0.2929], [-1.2883, 0.2761], [-1.2661, 0.2476], [-1.2513, 0.2135], [-1.2403, 0.1775], [-1.2285, 0.1419], [-1.216, 0.1065], [-1.2046, 0.0707], [-1.1934, 0.0348], [-1.181, -0.0005], [-1.1684, -0.0359], [-1.1571, -0.0717], [-1.146, -0.1076], [-1.1345, -0.1434], [-1.1235, -0.1794], [-1.112, -0.2151], [-1.0995, -0.2505], [-1.0874, -0.286], [-1.0758, -0.3217], [-1.0635, -0.3572], [-1.051, -0.3925], [-1.0393, -0.4282], [-1.0286, -0.4643], [-1.0175, -0.5], [-1.011, -0.5353], [-1.0189, -0.5676], [-1.0442, -0.5896], [-1.0802, -0.5986], [-1.1199, -0.6006], [-1.1603, -0.6007], [-1.2009, -0.6007], [-1.2414, -0.6007], [-1.2819, -0.6007], [-1.3224, -0.6007], [-1.363, -0.6007], [-1.4035, -0.6007], [-1.444, -0.6007], [-1.4846, -0.6007], [-1.5251, -0.6007], [-1.5656, -0.6007], [-1.6061, -0.6007], [-1.6463, -0.5999], [-1.6839, -0.5938], [-1.7125, -0.5754], [-1.7255, -0.5452], [-1.7223, -0.5103], [-1.7105, -0.4751], [-1.6964, -0.4404], [-1.6816, -0.406], [-1.6665, -0.3717], [-1.6521, -0.3372], [-1.6382, -0.3024], [-1.6235, -0.268], [-1.6077, -0.234], [-1.5926, -0.1997], [-1.5783, -0.1652], [-1.5641, -0.1305], [-1.55, -0.0958], [-1.5361, -0.061], [-1.5223, -0.0262], [-1.5081, 0.0084], [-1.4935, 0.0429], [-1.4791, 0.0775], [-1.4647, 0.112], [-1.4499, 0.1464], [-1.4346, 0.1806], [-1.4197, 0.215], [-1.4032, 0.2483], [-1.3805, 0.2765]], "bell_right": [[-0.545, 1.9633], [-0.5799, 1.9586], [-0.614, 1.9517], [-0.6472, 1.9427], [-0.6792, 1.9309], [-0.7102, 1.9166], [-0.7403, 1.9004], [-0.7693, 1.8819], [-0.7956, 1.86], [-0.8176, 1.8339], [-0.8333, 1.8042], [-0.8399, 1.7719], [-0.8357, 1.7395], [-0.821, 1.7095], [-0.7983, 1.6836], [-0.7712, 1.6618], [-0.7422, 1.6427], [-0.7131, 1.6241], [-0.6842, 1.6046], [-0.6556, 1.5845], [-0.6271, 1.5645], [-0.5998, 1.5444], [-0.5788, 1.5219], [-0.5711, 1.4958], [-0.5787, 1.4676], [-0.5961, 1.4391], [-0.6167, 1.4108], [-0.6374, 1.3825], [-0.6558, 1.3532], [-0.6678, 1.322], [-0.6695, 1.2894], [-0.6597, 1.2594], [-0.6394, 1.236], [-0.6117, 1.2215], [-0.5807, 1.2183], [-0.5503, 1.2272], [-0.5232, 1.246], [-0.5003, 1.2711], [-0.4794, 1.2989], [-0.458, 1.3269], [-0.4353, 1.3535], [-0.4104, 1.3752], [-0.3827, 1.3849], [-0.3534, 1.3796], [-0.324, 1.3644], [-0.295, 1.3456], [-0.2662, 1.3262], [-0.2373, 1.3068], [-0.2087, 1.2868], [-0.1803, 1.2662], [-0.1517, 1.2462], [-0.1227, 1.2271], [-0.0932, 1.2092], [-0.0626, 1.1952], [-0.0306, 1.189], [0.0015, 1.1932], [0.0314, 1.2076], [0.057, 1.23], [0.077, 1.2578], [0.0909, 1.2889], [0.1, 1.322], [0.1054, 1.3567], [0.108, 1.3925], [0.1084, 1.4288], [0.1064, 1.4647], [0.1015, 1.4995], [0.0941, 1.5334], [0.0847, 1.5664], [0.0736, 1.5987], [0.0607, 1.6303], [0.0459, 1.661], [0.0292, 1.691], [0.0105, 1.7202], [-0.0109, 1.7483], [-0.0351, 1.7751], [-0.0609, 1.801], [-0.0878, 1.8252], [-0.1158, 1.8466], [-0.1449, 1.8654], [-0.1747, 1.8825], [-0.2051, 1.8983], [-0.236, 1.9128], [-0.2676, 1.9257], [-0.3, 1.9365], [-0.3334, 1.9451], [-0.3673, 1.9523], [-0.4016, 1.9586], [-0.4366, 1.9633], [-0.4725, 1.9654], [-0.509, 1.9654]], "bell_left": [[-2.1629, 1.9633], [-2.1981, 1.9586], [-2.2327, 1.9522], [-2.2668, 1.9448], [-2.3002, 1.9357], [-2.3327, 1.9243], [-2.3644, 1.911], [-2.3954, 1.8962], [-2.4256, 1.8793], [-2.4551, 1.8607], [-2.4842, 1.841], [-2.5123, 1.8192], [-2.539, 1.7946], [-2.5643, 1.7683], [-2.5881, 1.741], [-2.6103, 1.7129], [-2.6299, 1.6839], [-2.6475, 1.654], [-2.6636, 1.6235], [-2.6783, 1.5924], [-2.691, 1.5604], [-2.7014, 1.5275], [-2.7097, 1.4938], [-2.7163, 1.4593], [-2.721, 1.4241], [-2.7226, 1.388], [-2.7208, 1.352], [-2.7155, 1.3171], [-2.7063, 1.2837], [-2.6922, 1.2528], [-2.6717, 1.226], [-2.6452, 1.2054], [-2.6145, 1.1926], [-2.582, 1.1894], [-2.5498, 1.196], [-2.5187, 1.2097], [-2.4888, 1.227], [-2.4593, 1.2457], [-2.4299, 1.2644], [-2.4005, 1.2833], [-2.3713, 1.3025], [-2.342, 1.3217], [-2.3125, 1.3403], [-2.2829, 1.3584], [-2.2529, 1.3739], [-2.2226, 1.3808], [-2.1942, 1.3735], [-2.1701, 1.3529], [-2.1495, 1.3256], [-2.1297, 1.2968], [-2.1092, 1.2687], [-2.0864, 1.244], [-2.0592, 1.2262], [-2.0285, 1.2186], [-1.9977, 1.2235], [-1.9706, 1.2405], [-1.9508, 1.2662], [-1.9419, 1.2965], [-1.9458, 1.328], [-1.9594, 1.3586], [-1.9773, 1.3884], [-1.9962, 1.4177], [-2.0139, 1.4473], [-2.0262, 1.4773], [-2.0254, 1.5064], [-2.0089, 1.5317], [-1.9827, 1.5525], [-1.9536, 1.5715], [-1.9244, 1.5909], [-1.8952, 1.6102], [-1.8658, 1.6289], [-1.8363, 1.6476], [-1.8076, 1.6674], [-1.7812, 1.6894], [-1.7602, 1.7153], [-1.748, 1.746], [-1.7461, 1.7794], [-1.7547, 1.8118], [-1.7728, 1.8401], [-1.7977, 1.8639], [-1.8259, 1.8844], [-1.8557, 1.9023], [-1.8864, 1.9178], [-1.9182, 1.931], [-1.9508, 1.9421], [-1.9842, 1.9511], [-2.0186, 1.958], [-2.0538, 1.9626], [-2.09, 1.965], [-2.1267, 1.9653]]};

  // 2. PROCEDURAL WEB AUDIO SYNTHESIZER
  class AlarmLogoSoundEngine {
    constructor() {
      this.ctx = null;
      this.master = null;
      this.muted = false;
      this.volume = 0.85;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        this.ctx = new AudioCtx();
        this.master = this.ctx.createGain();
        this.master.gain.value = this.volume;
        this.master.connect(this.ctx.destination);
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    setVolume(val) {
      this.volume = val;
      if (this.master && this.ctx) {
        this.master.gain.setTargetAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime, 0.02);
      }
    }

    toggleMute() {
      this.muted = !this.muted;
      this.setVolume(this.volume);
      return this.muted;
    }

    // Sound 1: Twin-Bell Alarm Clock Burst (Rapid alternating hammer strikes)
    playTwinBellAlarmBurst(duration = 1.15) {
      this.init();
      if (!this.ctx || this.muted) return;
      try {
        const now = this.ctx.currentTime;
        const strikeRate = 22; // 22 strikes per second
        const totalStrikes = Math.floor(duration * strikeRate);

        for (let i = 0; i < totalStrikes; i++) {
          const strikeTime = now + i * (1 / strikeRate);
          const isLeftBell = i % 2 === 0;
          const partials = isLeftBell
            ? [1580, 2390, 3420]
            : [1720, 2580, 3690];

          partials.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.type = idx === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, strikeTime);

            const amp = (0.12 / (idx + 1)) * (0.85 + 0.15 * Math.random());
            g.gain.setValueAtTime(amp, strikeTime);
            g.gain.exponentialRampToValueAtTime(0.0008, strikeTime + 0.075);

            osc.connect(g);
            g.connect(this.master);
            osc.start(strikeTime);
            osc.stop(strikeTime + 0.08);
          });
        }
      } catch (e) {
        console.warn('Twin bell audio error:', e);
      }
    }

    // Sound 2: Elastic Pop (3D Squash & Jump)
    playElasticPop(freq = 380) {
      this.init();
      if (!this.ctx || this.muted) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * 0.55, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.65, now + 0.065);
        osc.frequency.exponentialRampToValueAtTime(freq, now + 0.16);

        gain.gain.setValueAtTime(0.38, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        osc.connect(gain);
        gain.connect(this.master);
        osc.start(now);
        osc.stop(now + 0.19);
      } catch (e) {}
    }

    // Sound 3: 360° Flip Whoosh (Deep cinematic sweep + sub-bass punch)
    playWhoosh(duration = 0.75, pitchStart = 140, pitchEnd = 520) {
      this.init();
      if (!this.ctx || this.muted) return;
      try {
        const now = this.ctx.currentTime;
        const bufLen = Math.floor(this.ctx.sampleRate * duration);
        const buf = this.ctx.createBuffer(1, bufLen, this.ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufLen; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufLen) * Math.PI);
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buf;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.value = 2.8;
        filter.frequency.setValueAtTime(pitchStart, now);
        filter.frequency.exponentialRampToValueAtTime(pitchEnd, now + duration * 0.65);
        filter.frequency.exponentialRampToValueAtTime(140, now + duration);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.32, now + duration * 0.45);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        const sub = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(95, now);
        sub.frequency.exponentialRampToValueAtTime(38, now + duration * 0.8);
        subGain.gain.setValueAtTime(0.35, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.85);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.master);

        sub.connect(subGain);
        subGain.connect(this.master);

        noise.start(now);
        sub.start(now);
        sub.stop(now + duration);
      } catch (e) {
        console.warn('Whoosh audio error:', e);
      }
    }

    // Sound 4: Brand Sting (Harmonic Logo Chord - Crystalline A major 9 / Eadd9)
    playBrandLogoChime() {
      this.init();
      if (!this.ctx || this.muted) return;
      try {
        const now = this.ctx.currentTime;
        const notes = [220.0, 329.63, 440.0, 554.37, 659.25, 987.77, 1318.5];
        notes.forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = i < 2 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.035);

          const peak = i < 2 ? 0.16 : 0.085;
          gain.gain.setValueAtTime(0.001, now + i * 0.035);
          gain.gain.linearRampToValueAtTime(peak, now + i * 0.035 + 0.06);
          gain.gain.exponentialRampToValueAtTime(0.0008, now + 2.4);

          osc.connect(gain);
          gain.connect(this.master);
          osc.start(now + i * 0.035);
          osc.stop(now + 2.45);
        });
      } catch (e) {}
    }
  }

  const soundFX = new AlarmLogoSoundEngine();
  window.AlarmLogoSoundFX = soundFX;

  // 3. THREE.JS 3D SCENE SETUP & MESH CREATION
  function initAlarmLogo3D() {
    const canvas = document.getElementById('logo3dCanvas');
    const container = document.getElementById('logo3dRig');
    if (!canvas || !container || typeof THREE === 'undefined') {
      return;
    }

    const scene = new THREE.Scene();

    const getAspect = () => {
      const w = container.clientWidth || 300;
      const h = container.clientHeight || 280;
      return { w, h, ratio: w / h };
    };

    const initial = getAspect();
    const camera = new THREE.PerspectiveCamera(34, initial.ratio, 0.1, 100);
    
    // Dynamic Z camera placement so logo is framed with perfect breathing space
    const updateCameraZ = (ratio) => {
      if (ratio < 0.85) {
        camera.position.set(0, 0, 17.5);
      } else if (ratio < 1.05) {
        camera.position.set(0, 0, 16.2);
      } else {
        camera.position.set(0, 0, 15.2);
      }
    };
    updateCameraZ(initial.ratio);

    // Renderer with ALPHA: TRUE (100% TRANSPARENT BACKGROUND)
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(initial.w, initial.h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5));
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.45);
    keyLight.position.set(5, 8, 12);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const sweepLight = new THREE.PointLight(0xe9d5ff, 2.2, 22);
    sweepLight.position.set(-6, 4, 6);
    scene.add(sweepLight);

    const rimLight = new THREE.DirectionalLight(0xa855f7, 1.3);
    rimLight.position.set(-7, -5, -8);
    scene.add(rimLight);

    // Helpers
    function pointsToShape(pts) {
      const shape = new THREE.Shape();
      pts.forEach((p, idx) => {
        if (idx === 0) shape.moveTo(p[0], p[1]);
        else shape.lineTo(p[0], p[1]);
      });
      shape.closePath();
      return shape;
    }

    function createPurpleGradientTexture() {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 512;
      const ctx = c.getContext('2d');
      const grad = ctx.createLinearGradient(0, 512, 512, 0);
      grad.addColorStop(0.0, '#3a02df');
      grad.addColorStop(0.5, '#5203f4');
      grad.addColorStop(1.0, '#7c02ff');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      const tex = new THREE.CanvasTexture(c);
      tex.needsUpdate = true;
      return tex;
    }

    // Root Group
    const logoRoot = new THREE.Group();
    scene.add(logoRoot);

    // 1. 3D Extruded Squircle App Icon Badge
    const squircleShape = pointsToShape(LOGO_CONTOURS.squircle);
    const squircleGeo = new THREE.ExtrudeGeometry(squircleShape, {
      steps: 1,
      depth: 0.72,
      bevelEnabled: true,
      bevelThickness: 0.22,
      bevelSize: 0.18,
      bevelOffset: 0,
      bevelSegments: 6
    });

    const posAttr = squircleGeo.attributes.position;
    const uvAttr = squircleGeo.attributes.uv;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vy = posAttr.getY(i);
      uvAttr.setXY(i, (vx + 3.9) / 7.8, (vy + 3.9) / 7.8);
    }
    uvAttr.needsUpdate = true;
    squircleGeo.translate(0, 0, -0.72);

    const squircleFaceMat = new THREE.MeshPhysicalMaterial({
      map: createPurpleGradientTexture(),
      roughness: 0.24,
      metalness: 0.08,
      clearcoat: 0.9,
      clearcoatRoughness: 0.14
    });

    const squircleSideMat = new THREE.MeshPhysicalMaterial({
      color: 0x3b03d9,
      roughness: 0.28,
      metalness: 0.25,
      clearcoat: 0.8
    });

    const squircleMesh = new THREE.Mesh(squircleGeo, [squircleFaceMat, squircleSideMat]);
    squircleMesh.receiveShadow = true;
    logoRoot.add(squircleMesh);

    // Subtle Metallic Back Plate
    const backPlateGeo = new THREE.ExtrudeGeometry(squircleShape, {
      steps: 1,
      depth: 0.08,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.06,
      bevelSegments: 4
    });
    backPlateGeo.translate(0, 0, -0.96);
    const backPlateMat = new THREE.MeshStandardMaterial({
      color: 0x1e026e,
      roughness: 0.3,
      metalness: 0.7
    });
    const backPlateMesh = new THREE.Mesh(backPlateGeo, backPlateMat);
    logoRoot.add(backPlateMesh);

    // Porcelain-White Materials for 'AM' and Bells
    const whiteFrontMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.32,
      roughness: 0.14,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08
    });

    const whiteBevelMat = new THREE.MeshPhysicalMaterial({
      color: 0xf1ebff,
      emissive: 0xd8b4fe,
      emissiveIntensity: 0.12,
      roughness: 0.22,
      metalness: 0.18,
      clearcoat: 0.9
    });

    const whiteMaterials = [whiteFrontMat, whiteBevelMat];

    const letterExtrudeSettings = {
      steps: 1,
      depth: 0.42,
      bevelEnabled: true,
      bevelThickness: 0.09,
      bevelSize: 0.055,
      bevelOffset: 0,
      bevelSegments: 5
    };

    // 2. 3D Extruded 'AM' Ligature Monogram
    const amShape = pointsToShape(LOGO_CONTOURS.am_outer);
    const aHolePath = new THREE.Path();
    LOGO_CONTOURS.a_hole.forEach((p, idx) => {
      if (idx === 0) aHolePath.moveTo(p[0], p[1]);
      else aHolePath.lineTo(p[0], p[1]);
    });
    aHolePath.closePath();
    amShape.holes.push(aHolePath);

    const amGeo = new THREE.ExtrudeGeometry(amShape, letterExtrudeSettings);
    const AM_PIVOT_Y = -2.05;
    amGeo.translate(0, -AM_PIVOT_Y, 0);

    const amPivotGroup = new THREE.Group();
    amPivotGroup.position.set(0, AM_PIVOT_Y, 0.16);
    const amMesh = new THREE.Mesh(amGeo, whiteMaterials);
    amMesh.castShadow = true;
    amMesh.receiveShadow = true;
    amPivotGroup.add(amMesh);
    logoRoot.add(amPivotGroup);

    // 3. 3D Left Bell
    const LEFT_BELL_PIVOT = { x: -1.94, y: 1.25 };
    const leftBellShape = pointsToShape(LOGO_CONTOURS.bell_left);
    const leftBellGeo = new THREE.ExtrudeGeometry(leftBellShape, letterExtrudeSettings);
    leftBellGeo.translate(-LEFT_BELL_PIVOT.x, -LEFT_BELL_PIVOT.y, 0);

    const leftBellPivot = new THREE.Group();
    leftBellPivot.position.set(LEFT_BELL_PIVOT.x, LEFT_BELL_PIVOT.y, 0.16);
    const leftBellMesh = new THREE.Mesh(leftBellGeo, whiteMaterials);
    leftBellMesh.castShadow = true;
    leftBellPivot.add(leftBellMesh);
    logoRoot.add(leftBellPivot);

    // 4. 3D Right Bell
    const RIGHT_BELL_PIVOT = { x: -0.66, y: 1.25 };
    const rightBellShape = pointsToShape(LOGO_CONTOURS.bell_right);
    const rightBellGeo = new THREE.ExtrudeGeometry(rightBellShape, letterExtrudeSettings);
    rightBellGeo.translate(-RIGHT_BELL_PIVOT.x, -RIGHT_BELL_PIVOT.y, 0);

    const rightBellPivot = new THREE.Group();
    rightBellPivot.position.set(RIGHT_BELL_PIVOT.x, RIGHT_BELL_PIVOT.y, 0.16);
    const rightBellMesh = new THREE.Mesh(rightBellGeo, whiteMaterials);
    rightBellMesh.castShadow = true;
    rightBellPivot.add(rightBellMesh);
    logoRoot.add(rightBellPivot);

    // 5. 3D Sonic Shockwave Rings
    const shockwavesGroup = new THREE.Group();
    logoRoot.add(shockwavesGroup);
    const waveRings = [];
    const bellCenters = [
      { x: -2.35, y: 1.68, angle: 2.35 },
      { x: -0.25, y: 1.68, angle: 0.78 }
    ];

    bellCenters.forEach((bc, bIdx) => {
      for (let i = 0; i < 3; i++) {
        const arcGeo = new THREE.TorusGeometry(0.55 + i * 0.36, 0.045, 12, 32, Math.PI * 0.65);
        const arcMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.0
        });
        const arcMesh = new THREE.Mesh(arcGeo, arcMat);
        arcMesh.position.set(bc.x, bc.y, 0.42);
        arcMesh.rotation.z = bc.angle - (Math.PI * 0.65) / 2;
        shockwavesGroup.add(arcMesh);
        waveRings.push({ mesh: arcMesh, mat: arcMat, bellIdx: bIdx, ringIdx: i, baseAngle: bc.angle });
      }
    });

    // Interaction & Animation State
    let reliefMultiplier = 1.25;
    let manualRingTimer = 0.0;
    let manualBounceTimer = 0.0;
    let manualSpinTimer = 0.0;
    let userYaw = 0.0;
    let userPitch = 0.0;
    let isDragging = false;
    let prevPointer = { x: 0, y: 0 };

    // Function to highlight the active soundboard button
    function setActiveButton(btnId) {
      const ids = ['act-ring-now', 'act-bounce', 'act-spin', 'act-chime'];
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        if (id === btnId) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      });
    }

    // 4 Distinct Sound & Motion Trigger Functions (Photo 2)
    function triggerRingAlarm(playAudio = true) {
      setActiveButton('act-ring-now');
      if (playAudio) soundFX.playTwinBellAlarmBurst(1.15);
      manualRingTimer = 1.15;
      manualBounceTimer = 0.45;
    }

    function triggerElasticPop(playAudio = true) {
      setActiveButton('act-bounce');
      if (playAudio) soundFX.playElasticPop(380);
      manualBounceTimer = 0.65;
    }

    function triggerFlip360(playAudio = true) {
      setActiveButton('act-spin');
      if (playAudio) soundFX.playWhoosh(0.75, 140, 520);
      manualSpinTimer = 0.95;
    }

    function triggerBrandChime(playAudio = true) {
      setActiveButton('act-chime');
      if (playAudio) soundFX.playBrandLogoChime();
      manualRingTimer = 0.35;
      manualBounceTimer = 0.3;
    }

    // Expose functions globally
    window.triggerAlarmLogoRing = triggerRingAlarm;
    window.triggerAlarmLogoPop = triggerElasticPop;
    window.triggerAlarmLogoSpin = triggerFlip360;
    window.triggerAlarmLogoChime = triggerBrandChime;

    // Pointer events for free 3D rotation
    container.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button, input, .logo-soundboard-card')) return;
      isDragging = true;
      prevPointer = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevPointer.x;
      const dy = e.clientY - prevPointer.y;
      prevPointer = { x: e.clientX, y: e.clientY };
      userYaw += dx * 0.009;
      userPitch = Math.max(-0.65, Math.min(0.65, userPitch + dy * 0.009));
    });

    window.addEventListener('pointerup', () => {
      isDragging = false;
    });

    // Tap/click on 3D logo cycles through all 4 sounds sequentially!
    const soundActions = [triggerRingAlarm, triggerElasticPop, triggerFlip360, triggerBrandChime];
    let actionIndex = 0;

    container.addEventListener('click', (e) => {
      if (e.target.closest('button, input, .logo-soundboard-card')) return;
      soundFX.init();
      soundActions[actionIndex](true);
      actionIndex = (actionIndex + 1) % soundActions.length;
    });

    // Wire up all 4 Soundboard Buttons (Photo 2)
    const btnRing = document.getElementById('act-ring-now');
    if (btnRing) {
      btnRing.addEventListener('click', (e) => {
        e.stopPropagation();
        soundFX.init();
        actionIndex = 0;
        triggerRingAlarm(true);
      });
    }

    const btnBounce = document.getElementById('act-bounce');
    if (btnBounce) {
      btnBounce.addEventListener('click', (e) => {
        e.stopPropagation();
        soundFX.init();
        actionIndex = 1;
        triggerElasticPop(true);
      });
    }

    const btnSpin = document.getElementById('act-spin');
    if (btnSpin) {
      btnSpin.addEventListener('click', (e) => {
        e.stopPropagation();
        soundFX.init();
        actionIndex = 2;
        triggerFlip360(true);
      });
    }

    const btnChime = document.getElementById('act-chime');
    if (btnChime) {
      btnChime.addEventListener('click', (e) => {
        e.stopPropagation();
        soundFX.init();
        actionIndex = 3;
        triggerBrandChime(true);
      });
    }

    // 3D Extrusion Depth Slider (Photo 2)
    const depthSlider = document.getElementById('slider-depth');
    const depthValLabel = document.getElementById('depth-val-label');
    if (depthSlider) {
      depthSlider.addEventListener('input', (e) => {
        reliefMultiplier = parseFloat(e.target.value);
        if (depthValLabel) {
          depthValLabel.textContent = reliefMultiplier.toFixed(2) + 'x';
        }
      });
    }

    // Sound Mute Toggle
    const soundToggle = document.getElementById('logoSoundToggle');
    if (soundToggle) {
      soundToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        soundFX.init();
        const isMuted = soundFX.toggleMute();
        const icon = document.getElementById('logoSoundIcon');
        const label = document.getElementById('logoSoundLabel');
        if (icon) {
          icon.className = isMuted ? 'ph ph-speaker-slash' : 'ph ph-speaker-high';
        }
        if (label) {
          label.textContent = isMuted ? 'Muted' : 'Sound On';
        }
      });
    }

    // Resize handler
    window.addEventListener('resize', () => {
      const a = getAspect();
      camera.aspect = a.ratio;
      updateCameraZ(a.ratio);
      camera.updateProjectionMatrix();
      renderer.setSize(a.w, a.h);
    });

    // Render loop
    let prevNow = performance.now();
    function animate(now) {
      requestAnimationFrame(animate);
      const dt = Math.min(0.05, (now - prevNow) / 1000);
      prevNow = now;

      const tSec = now * 0.001;

      // Idle floating motion
      const idleFloatY = Math.sin(tSec * 1.6) * 0.12;
      const idleYaw = Math.sin(tSec * 0.8) * 0.14;
      const idlePitch = Math.cos(tSec * 1.1) * 0.08;

      let badgePosY = idleFloatY;
      let badgeRotX = idlePitch + userPitch;
      let badgeRotY = idleYaw + userYaw;
      let badgeRotZ = 0.0;

      let amScaleX = 1.0;
      let amScaleY = 1.0;
      let bellRingIntensity = 0.0;

      // Layer 1: Manual Ring Alarm! effects
      if (manualRingTimer > 0) {
        manualRingTimer = Math.max(0, manualRingTimer - dt);
        bellRingIntensity = 1.0;
        badgeRotZ += Math.sin(now * 0.065) * 0.06;
        badgePosY += Math.sin(now * 0.05) * 0.14;
      }

      // Layer 2: Manual Elastic Pop effects (Squash & Jump)
      if (manualBounceTimer > 0) {
        manualBounceTimer = Math.max(0, manualBounceTimer - dt);
        const bu = 1.0 - manualBounceTimer / 0.65;
        const bArc = Math.sin(bu * Math.PI);
        badgePosY += bArc * 0.55;
        amScaleY *= 1.0 + Math.sin(bu * Math.PI * 2) * 0.16;
        amScaleX *= 1.0 - Math.sin(bu * Math.PI * 2) * 0.11;
      }

      // Layer 3: Manual 360° Flip effects (Hero Spin)
      if (manualSpinTimer > 0) {
        manualSpinTimer = Math.max(0, manualSpinTimer - dt);
        const su = (1.0 - manualSpinTimer / 0.95);
        const smoothU = su * su * (3 - 2 * su);
        badgeRotY += smoothU * Math.PI * 2.0;
      }

      // Smooth decay of user drag orbit back to center if inactive
      if (!isDragging) {
        userYaw *= 0.96;
        userPitch *= 0.96;
      }

      // Apply root transforms
      logoRoot.position.set(0, badgePosY, 0);
      logoRoot.rotation.set(badgeRotX, badgeRotY, badgeRotZ);

      // 'AM' scale and live relief depth
      amPivotGroup.scale.set(amScaleX, amScaleY, reliefMultiplier);

      // Bell oscillation and live relief depth
      const hammerAngle = bellRingIntensity * Math.sin(now * 0.075) * 0.28;
      const bellOffset = bellRingIntensity * Math.abs(Math.cos(now * 0.075)) * 0.09;

      leftBellPivot.scale.set(1.0, 1.0, reliefMultiplier);
      leftBellPivot.rotation.z = hammerAngle;
      leftBellPivot.position.set(
        LEFT_BELL_PIVOT.x - bellOffset * 0.5,
        LEFT_BELL_PIVOT.y + bellOffset,
        0.16
      );

      rightBellPivot.scale.set(1.0, 1.0, reliefMultiplier);
      rightBellPivot.rotation.z = -hammerAngle;
      rightBellPivot.position.set(
        RIGHT_BELL_PIVOT.x + bellOffset * 0.5,
        RIGHT_BELL_PIVOT.y + bellOffset,
        0.16
      );

      // Sonic shockwave expansion
      const waveClock = (now * 0.0035) % 1.0;
      waveRings.forEach((w) => {
        if (bellRingIntensity > 0.05) {
          const cycle = (waveClock + w.ringIdx * 0.33) % 1.0;
          const s = 0.65 + cycle * 0.95;
          w.mesh.scale.set(s, s, 1);
          w.mat.opacity = (1.0 - cycle) * 0.85 * bellRingIntensity;
        } else {
          w.mat.opacity = 0.0;
        }
      });

      // Moving specular highlight light
      sweepLight.position.x = Math.sin(tSec * 1.2) * 7.0;
      sweepLight.position.y = Math.cos(tSec * 0.9) * 4.5;

      renderer.render(scene, camera);
    }

    requestAnimationFrame(animate);
  }

  // Initialize on DOMContentLoaded or immediate if ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAlarmLogo3D);
  } else {
    setTimeout(initAlarmLogo3D, 50);
  }
})();
