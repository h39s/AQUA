import { DefineStepFunction } from 'jest-cucumber';
import { Driver } from '__tests__/utils/webdriver';

export const givenChartViewEnabledState = (
  when: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  when(/^ChartView is (enabled|disabled)$/, async (state: string) => {
    const desiredState = state === 'enabled';
    const chartViewSwitch = await webdriver.driver.$(
      '.sideBar label[class="switch"][for="chartEnabler"]'
    );

    const switchOn = await chartViewSwitch
      .$('[aria-checked="true"]')
      .isExisting();
    if ((desiredState && !switchOn) || (!desiredState && switchOn)) {
      chartViewSwitch.click();
      // wait 1000 ms for the action.
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  });
};

export const thenGraph = (
  then: DefineStepFunction,
  webdriver: { driver: Driver | undefined }
) => {
  then(/^Aqua should show the (\w+) graph at (\d+)Hz$/, async () => {
    const curveElem = await webdriver.driver.$('path[name="Response"]');
    const d = await curveElem.getAttribute('d');
    expect(d).toBe(
      'M50,155.9620300414876L50.878,156.01060029790796L51.75599999999995,156.05982185595255L52.63399999999996,156.10970194263078L53.51199999999999,156.16024782624186L54.38999999999995,156.211466815615L55.268,156.2633662593227L56.145999999999994,156.3159535448677L57.024,156.36923609784233L57.90199999999995,156.42322138106155L58.78,156.477916893669L59.658,156.5333301702159L60.53599999999995,156.58946877971346L61.414,156.64634032465858L62.291999999999994,156.70395244003257L63.16999999999995,156.76231279227406L64.048,156.82142907822507L64.92599999999999,156.88130902405126L65.80399999999995,156.94196038413642L66.68199999999999,157.00339093995132L67.56,157.0656084988973L68.43799999999995,157.12862089312492L69.31599999999999,157.19243597832843L70.19399999999999,157.25706163251567L71.07199999999995,157.32250575475453L71.94999999999995,157.38877626389643L72.82799999999999,157.45588109727674L73.70599999999999,157.52382820939374L74.58399999999995,157.5926255705653L75.46199999999995,157.66228116556562L76.33999999999999,157.73280299224118L77.21799999999995,157.8041990601076L78.09599999999999,157.87647738892795L78.97399999999999,157.94964600727283L79.85199999999995,158.02371295106383L80.72999999999999,158.09868626210104L81.60799999999999,158.1745739865748L82.48599999999999,158.2513841735642L83.36399999999999,158.3291248735213L84.24199999999999,158.40780413674457L85.11999999999999,158.48743001184025L85.99799999999999,158.56801054417448L86.87599999999999,158.64955377431673L87.75399999999999,158.73206773647578L88.63199999999995,158.81556045692943L89.50999999999999,158.90003995244982L90.38799999999998,158.9855142287248L91.26599999999993,159.07199127877763L92.14399999999998,159.15947908138617L93.02199999999999,159.24798559950236L93.89999999999993,159.33751877867465L94.77799999999999,159.42808654547434L95.65599999999999,159.51969680592714L96.53399999999993,159.61235744395202L97.41199999999998,159.7060763198091L98.28999999999998,159.80086126855784L99.16799999999994,159.8967200985273L100.04599999999999,159.99366058980107L100.92399999999998,160.09169049271713L101.80199999999994,160.19081752638593L102.67999999999992,160.2910493772277L103.55799999999999,160.3923936975312L104.43599999999998,160.49485810403547L105.31399999999992,160.59845017653694L106.19199999999998,160.70317745652358L107.06999999999998,160.80904744583788L107.94799999999992,160.91606760537118L108.826,161.0242453537906L109.70399999999998,161.13358806630137L110.58200000000002,161.24410307344579L111.45999999999998,161.3557976599416L112.33799999999998,161.468679063561L113.216,161.5827544740534L114.09399999999991,161.6980310321124L114.97199999999998,161.8145158283909L115.84999999999997,161.932215902565L116.72799999999998,162.05113824244904L117.60599999999998,162.17128978316438L118.48399999999998,162.29267740636317L119.36199999999994,162.41530793950955L120.23999999999998,162.5391881552205L121.11800000000002,162.66432477066772L121.99599999999998,162.79072444704306L122.87399999999997,162.91839378908927L123.75199999999998,163.0473393446979L124.62999999999997,163.17756760457678L125.50799999999997,163.3090850019881L126.38599999999997,163.44189791255997L127.26399999999992,163.57601265417244L128.14199999999997,163.71143548692052L129.01999999999998,163.84817261315558L129.8979999999999,163.9862301776069L130.77599999999998,164.12561426758566L131.65399999999997,164.26633091327187L132.53199999999993,164.40838608808758L133.40999999999997,164.55178570915652L134.28799999999998,164.69653563785235L135.16599999999997,164.8426416804378L136.044,164.99010958879452L136.92199999999997,165.13894506124714L137.79999999999995,165.28915374348128L138.67800000000003,165.4407412295579L139.55599999999995,165.59371306302526L140.43399999999997,165.7480747381295L141.31199999999998,165.90383170112543L142.18999999999997,166.06098935168836L143.06799999999998,166.21955304442912L143.94600000000003,166.379528090512L144.82399999999996,166.54091975937857L145.70199999999994,166.70373328057647L146.58,166.86797384569616L147.45799999999997,167.03364661041522L148.33599999999996,167.20075669665212L149.21400000000003,167.3693091948298L150.09199999999996,167.53930916625055L150.96999999999997,167.7107616455829L151.84799999999996,167.88367164346084L152.72599999999994,168.0580441491976L153.60399999999996,168.2338841336135L154.48199999999997,168.4111965519791L155.35999999999996,168.58998634707513L156.23799999999994,168.77025845236915L157.11599999999996,168.95201779531L157.99399999999991,169.13526930074093L158.87199999999996,169.32001789443245L159.74999999999994,169.50626850673515L160.62799999999996,169.69402607635374L161.50599999999994,169.88329555424264L162.38399999999996,170.0740819076247L163.262,170.26639012413318L164.14,170.4602252160781L165.01799999999997,170.6555922248381L165.89600000000002,170.85249622537862L166.774,171.0509423308966L167.65199999999996,171.25093569759446L168.53,171.45248152958263L169.40800000000002,171.65558508391268L170.28599999999994,171.86025167574223L171.164,172.0664866836327L172.04200000000003,172.27429555498077L172.91999999999996,172.48368381158645L173.79799999999994,172.6946570553572L174.67600000000002,172.90722097415147L175.55399999999995,173.12138134776237L176.432,173.3371440540436L177.31,173.55451507517947L178.188,173.77350050410126L179.06599999999995,173.99410655105186L179.94399999999993,174.2163395503012L180.82199999999995,174.4402059670148L181.69999999999993,174.6657124042781L182.57799999999997,174.89286561027987L183.45599999999996,175.12167248565666L184.33399999999995,175.3521400910027L185.21199999999996,175.58427565454753L186.08999999999995,175.81808658000588L186.96799999999996,176.053580454603L187.846,176.2907650572796L188.72399999999993,176.529648367081L189.60199999999998,176.770238571735L190.47999999999996,177.01254407642273L191.35799999999995,177.2565735127483L192.23600000000002,177.5023357479127L193.11399999999995,177.7498398940966L193.99200000000002,177.99909531805983L194.87,178.25011165096242L195.74799999999993,178.50289879841472L196.626,178.7574669507639L197.504,179.0138265936234L198.38199999999998,179.27198851865515L199.26000000000002,179.53196383461062L200.13799999999998,179.79376397864144L201.01599999999993,180.05740072788817L201.89399999999998,180.3228862113571L202.772,180.5902329220955L203.64999999999995,180.85945372967643L204.52800000000002,181.1305618930041L205.406,181.4035710734529L206.28399999999993,181.67849534835145L207.16199999999995,181.95534922482673L208.04,182.23414765402086L208.91799999999995,182.51490604569665L209.79599999999996,182.79764028324672L210.67399999999998,183.08236673912327L211.55199999999996,183.3691022907054L212.42999999999995,183.65786433662245L213.308,183.9486708135523L214.18599999999995,184.24154021351546L215.06399999999994,184.53649160168493L215.942,184.83354463473566L216.81999999999994,185.13271957975599L217.69799999999998,185.43403733374635L218.57600000000002,185.73751944373086L219.45399999999992,186.04318812751004L220.332,186.35106629508192L221.20999999999992,186.66117757076393L222.08799999999997,186.9735463160457L222.96599999999998,187.28819765320767L223.84399999999994,187.60515748974004L224.722,187.92445254360035L225.6,188.2461103693484L226.47799999999995,188.57015938519987L227.356,188.8966289010432L228.23399999999998,189.2255491474648L229.11199999999994,189.55695130583197L229.98999999999998,189.89086753948484L230.868,190.2273310260907L231.74599999999995,190.56637599121888L232.624,190.90803774319593L233.502,191.252352709305L234.37999999999994,191.59935847339665L235.25799999999992,191.9490938149829L236.136,192.30159874988854L237.01399999999992,192.65691457254064L237.89199999999997,193.01508389997977L238.77,193.37615071768184L239.6479999999999,193.74016042728536L240.52599999999998,194.10715989632433L241.4039999999999,194.47719751007133L242.28199999999987,194.85032322560468L243.1599999999999,195.22658862821692L244.03799999999995,195.60604699029255L244.91599999999994,195.9887533327873L245.79399999999998,196.3747644894516L246.67199999999994,196.76413917394964L247.54999999999987,197.15693805003338L248.42800000000005,197.5532238049422L249.30599999999998,197.95306122620926L250.1839999999999,198.3565172820671L251.06199999999998,198.76366120565675L251.93999999999994,199.17456458325915L252.81799999999998,199.5893014467802L253.69600000000005,200.00794837073698L254.57399999999998,200.43058457400815L255.45199999999994,200.8572920266299L256.33,201.28815556193567L257.2079999999999,201.7232629943598L258.08599999999996,202.162705243245L258.96400000000006,202.60657646301777L259.842,203.05497418011936L260.7199999999999,203.507999437107L261.59799999999996,203.9657569443684L262.4759999999999,204.42835523992213L263.354,204.89590685781053L264.2319999999999,205.36852850562474L265.10999999999996,205.84634125174065L265.98799999999994,206.32947072288403L266.866,206.81804731268534L267.7439999999999,207.3122064019319L268.62199999999996,207.81208859127344L269.50000000000006,208.3178399471899L270.37799999999993,208.8296122620861L271.2559999999999,209.34756332943826L272.13399999999996,209.87185723497956L273.0119999999999,210.4026646649807L273.89,210.94016323275227L274.7679999999999,211.48453782456986L275.64599999999996,212.03598096630418L276.524,212.59469321211876L277.40199999999993,213.16088355668484L278.28,213.73476987245328L279.15799999999996,214.3165793736101L280.03599999999994,214.9065491084389L280.914,215.50492648190075L281.79200000000003,216.11196981033194L282.66999999999996,216.72794891024478L283.5479999999999,217.3531457232897L284.42599999999993,217.9878549794998L285.3039999999999,218.63238490098215L286.18199999999996,219.28705794823793L287.06,219.95221161127157L287.938,220.6281992475857L288.8159999999999,221.315390969025L289.69399999999996,222.01417457921644L290.5719999999999,222.72495656303025L291.45,223.44816312901497L292.32800000000003,224.1842413051077L293.206,224.93366008702947L294.08399999999995,225.69691163757463L294.962,226.4745125334092L295.8399999999999,227.2670050538918L296.71799999999996,228.0749585036764L297.596,228.89897055726635L298.474,229.73966860902868L299.3519999999999,230.59771110613482L300.22999999999996,231.47378883408408L301.1079999999999,232.36862611437957L301.986,233.28298186090828L302.864,234.21765042478373L303.742,235.17346213575445L304.62,236.15128342033537L305.498,237.1520163407665L306.37600000000003,238.17659735235813L307.254,239.2259950166725L308.1319999999999,240.3012063303582L309.00999999999993,241.4032512291631L309.888,242.53316469715725L310.76599999999996,243.69198574411675L311.6439999999999,244.88074229881374L312.52199999999993,246.10043078947334L313.39999999999986,247.35198882893695L314.27799999999985,248.63625897229224L315.15599999999995,249.95394094795532L316.034,251.30552905838684L316.9119999999999,252.69123058711807L317.78999999999996,254.11086003118203L318.6679999999999,255.56370282871268L319.5459999999998,257.04834105507734L320.424,258.5624325083437L321.30199999999996,260.10243406879704L322.1799999999999,261.66326086326126L323.05799999999994,263.2378756992345L323.9359999999999,264.8168101617686L324.81399999999985,266.3876320790093L325.692,267.93439665223366L326.57000000000005,269.43715296786013L327.44799999999987,270.87162402903004L328.3259999999999,272.20923089015025L329.20399999999995,273.41767279397925L330.0819999999999,274.46227358130307L330.96,275.3082183210017L331.838,275.9236026903183L332.7159999999999,276.2829200719207L333.594,276.37031795428567L334.47200000000004,276.1818290161594L335.34999999999985,275.72595415721673L336.228,275.0224252897188L337.10600000000005,274.0995087253935L337.98400000000004,272.9905727332944L338.86199999999997,271.73069739112066L339.74,270.35389749439133L340.61799999999994,268.89121745071014L341.496,267.36968785268067L342.374,265.81197565394683L343.252,264.2365095098866L344.13,262.65788058667096L345.008,261.0873674506598L345.88599999999997,259.53348516999L346.76399999999995,258.00250103686295L347.6420000000001,256.4988891827979L348.52000000000004,255.0257151947221L349.3979999999999,253.58495248663405L350.27599999999995,252.17773739976775L351.15399999999994,250.80457193397032L352.03199999999987,249.46548312276315L352.91,248.16014727961075L353.78799999999995,246.8879862058083L354.6659999999999,245.64824125604704L355.544,244.44003005087637L356.4219999999999,243.2623896647875L357.2999999999999,242.11430931737007L358.178,240.9947549432369L359.056,239.90268749515076L359.93399999999997,238.8370764226672L360.812,237.79690944532547L361.68999999999994,236.78119948716156L362.56799999999987,235.78898944318578L363.446,234.81935529631022L364.324,233.8714079853177L365.20199999999994,232.94429433318174L366.08,232.03719727438752L366.9579999999999,231.1493355651859L367.8359999999999,230.2799631183419L368.71399999999994,229.4283680711126L369.592,228.59387166974284L370.4699999999999,227.77582703404323L371.34799999999996,226.97361785032663L372.22599999999994,226.1866570291215L373.1039999999999,225.41438535489914L373.98199999999997,224.65627014794578L374.86,223.91180395301507L375.73799999999994,223.1805032651588L376.616,222.46190729987967L377.49399999999997,221.75557681225325L378.3719999999999,221.06109296776253L379.24999999999994,220.37805626615798L380.1279999999999,219.70608551857057L381.0059999999999,219.04481687731425L381.884,218.39390291723078L382.76200000000006,217.7530117670212L383.6399999999999,217.1218262887237L384.5179999999999,216.5000433033172L385.3960000000001,215.88737286032705L386.27399999999983,215.2835375492558L387.15200000000004,214.68827185066093L388.0300000000001,214.10132152473145L388.90799999999984,213.52244303525913L389.78599999999994,212.95140300697398L390.6640000000001,212.38797771429017L391.5419999999998,211.83195259959237L392.41999999999996,211.2831218192841L393.298,210.7412878159132L394.17599999999993,210.20626091477604L395.0539999999999,209.67785894349603L395.93199999999996,209.15590687315995L396.8099999999999,208.64023647967778L397.68799999999993,208.13068602411457L398.566,207.62709995082193L399.444,207.12932860226815L400.32199999999995,206.63722794953654L401.2,206.15065933752854L402.07800000000003,205.66948924396956L402.956,205.1935890513725L403.83400000000006,204.72283483117158L404.712,204.25710713928777L405.5899999999999,203.79629082243545L406.46799999999996,203.34027483452647L407.3459999999999,202.88895206256805L408.2239999999999,202.44221916148976L409.10200000000003,201.99997639737296L409.97999999999996,201.5621274985895L410.8579999999999,201.1285795143859L411.736,200.6992426804836L412.614,200.2740302912888L413.492,199.8528585783332L414.37,199.4356465945918L415.248,199.0223161043438L416.1259999999999,198.61279147826613L417.004,198.20699959346635L417.88199999999995,197.80486973818174L418.7599999999999,197.40633352088582L419.63800000000003,197.011324783563L420.51599999999996,196.61977951892257L421.39399999999995,196.23163579133978L422.272,195.84683366132452L423.1499999999999,195.4653151133283L424.02799999999985,195.08702398671318L424.906,194.71190590971594L425.784,194.339908236251L426.662,193.97097998540423L427.54,193.60507178347873L428.4179999999999,193.24213580846205L429.2959999999999,192.8821257367907L430.17400000000004,192.52499669229567L431.05199999999996,192.17070519722049L431.9299999999999,191.81920912520545L432.80799999999994,191.47046765614306L433.6859999999999,191.1244412328108L434.56399999999985,190.78109151919355L435.442,190.44038136041476L436.31999999999994,190.10227474419676L437.19799999999987,189.7667367637777L438.0759999999999,189.43373358221433L438.954,189.10323239800576L439.8319999999999,188.77520141197473L440.7099999999999,188.44960979534727L441.588,188.126427658976L442.46599999999995,187.80562602365228L443.344,187.48717679145753L444.22200000000004,187.17105271810686L445.09999999999985,186.85722738623878L445.9779999999999,186.54567517960757L446.85600000000005,186.23637125814003L447.7339999999999,185.92929153381522L448.61199999999997,185.62441264733172L449.49,185.32171194552862L450.36799999999994,185.02116745952537L451.24599999999987,184.72275788355006L452.1240000000001,184.4264625544268L453.002,184.132261431693L453.88,183.84013507831983L454.758,183.5500646420114L455.63599999999997,183.26203183705638L456.51399999999995,182.9760189267111L457.3920000000001,182.69200870609058L458.27000000000004,182.4099844855479L459.14799999999997,182.12993007452096L460.026,181.8518297658287L460.904,181.57566832039853L461.7819999999999,181.3014309524077L462.65999999999997,181.02910331482315L463.538,180.75867148532382L464.41599999999994,180.49012195259064L465.294,180.22344160295157L466.17199999999997,179.95861770736713L467.04999999999995,179.69563790874417L467.92800000000005,179.43449020956683L468.806,179.1751629598326L469.68399999999997,178.91764484528267L470.562,178.6619248759169L471.43999999999994,178.40799237478362L472.31799999999987,178.1558369670347L473.1959999999999,177.90544856923773L474.074,177.65681737893678L474.95199999999994,177.40993386445362L475.83,177.16478875492288L476.7079999999999,176.92137303055324L477.5859999999999,176.67967791310835L478.46399999999994,176.43969485660148L479.3419999999999,176.2014155381972L480.2199999999999,175.9648318493157L481.09799999999996,175.72993588693276L481.97599999999994,175.49671994507227L482.8539999999999,175.2651765064847L483.73199999999997,175.03529823450867L484.6099999999999,174.80707796511012L485.48799999999983,174.5805086990962L486.366,174.35558359449897L487.24399999999997,174.13229595912662L488.1219999999999,173.91063924327815L488.99999999999994,173.69060703261817L489.8779999999999,173.4721930412099L490.7559999999998,173.25539110470245L491.634,173.04019517367064L492.5119999999999,172.82659930710471L493.3899999999999,172.61459766604705L494.2679999999999,172.40418450737488L495.14599999999996,172.1953541777261L496.02399999999983,171.98810110756688L496.90200000000004,171.78241980539806L497.78000000000003,171.5783048521011L498.6579999999999,171.3757508954194L499.53599999999994,171.17475264457497L500.41400000000004,170.97530486501898L501.2919999999998,170.77740237331452L502.17,170.58104003215033L503.048,170.386212745485L503.92599999999993,170.19291545381952L504.8039999999999,170.00114312959772L505.682,169.81089077273396L506.5599999999999,169.62215340626628L507.438,169.43492607213452L508.316,169.24920382708268L509.194,169.0649817386844L510.07199999999995,168.8822548814908L510.95000000000005,168.70101833329963L511.8279999999999,168.5212671715458L512.7059999999999,168.34299646981086L513.5840000000001,168.1662012944525L514.462,167.9908767013521L515.3399999999999,167.8170177327796L516.2180000000001,167.64461941437517L517.0959999999999,167.47367675224737L517.9739999999999,167.30418473018554L518.852,167.1361383069872L519.73,166.96953241389843L520.608,166.80436195216694L521.486,166.64062179070677L522.3639999999999,166.47830676387366L523.242,166.31741166935026L524.12,166.15793126613977L524.998,165.99986027266777L525.876,165.84319336499055L526.754,165.6879251751088L527.632,165.5340502893863L528.5099999999999,165.38156324707134L529.388,165.23045853892077L530.266,165.08073060592488L531.1439999999999,164.9323738381314L532.0219999999999,164.7853825735686L532.9,164.63975109726474L533.7779999999999,164.4954736403633L534.656,164.35254437933276L535.534,164.21095743526828L536.4119999999999,164.0707068732854L537.29,163.93178670200257L538.168,163.79419087311274L539.0459999999998,163.65791328104024L539.924,163.5229477626835L540.8019999999998,163.3892880972403L541.68,163.25692800611458L542.558,163.12586115290281L543.4359999999999,162.9960811434585L544.3139999999999,162.8675815260324L545.1919999999999,162.74035579148705L546.0699999999999,162.61439737358387L546.948,162.48969964934025L547.8259999999999,162.36625593945584L548.704,162.24405950880467L549.5819999999998,162.12310356699263L550.4599999999999,162.0033812689769L551.3380000000001,161.88488571574706L552.2159999999999,161.76760995506373L553.0939999999999,161.65154698225447L553.972,161.53668974106463L554.8499999999999,161.42303112456025L555.728,161.31056397608148L556.606,161.19928109024522L557.4839999999999,161.08917521399349L558.362,160.98023904768652L559.24,160.87246524623856L560.1179999999999,160.76584642029331L560.996,160.6603751374385L561.874,160.5560439234562L562.7520000000001,160.4528452636077L563.63,160.35077160395053L564.5080000000002,160.249815352686L565.386,160.1499688815349L566.264,160.05122452713957L567.1419999999998,159.95357459249078L568.0200000000001,159.85701134837666L568.898,159.76152703485272L569.776,159.66711386273042L570.654,159.57376401508296L571.5319999999998,159.48146964876582L572.41,159.39022289595127L573.288,159.30001586567397L574.1659999999999,159.21084064538695L575.044,159.12268930252532L575.9219999999999,159.03555388607708L576.7999999999998,158.9494264281588L577.678,158.86429894559416L578.5559999999998,158.78016344149535L579.4339999999999,158.69701190684376L580.3119999999999,158.61483632207032L581.1899999999999,158.53362865863312L582.068,158.45338088059071L582.9459999999999,158.3740849461709L583.824,158.29573280933224L584.7019999999999,158.218316421318L585.58,158.1418277322014L586.4580000000001,158.0662586924201L587.3359999999999,157.99160125429947L588.214,157.91784737356372L589.0919999999999,157.84498901083322L589.9699999999999,157.77301813310737L590.8480000000001,157.7019267152321L591.726,157.63170674135068L592.6039999999999,157.56235020633787L593.482,157.49384911721532L594.3599999999999,157.42619549454824L595.2379999999999,157.35938137382277L596.116,157.2933988068024L596.994,157.22823986286394L597.8719999999998,157.16389663031117L598.75,157.10036121766686L599.6279999999999,157.03762575494144L600.5060000000001,156.9756823948788L601.384,156.9145233141778L602.262,156.85414071468998L603.14,156.79452682459208L604.018,156.7356738995344L604.8959999999998,156.67757422376275L605.774,156.62022011121545L606.6519999999999,156.56360390659444L607.5299999999997,156.5077179864098L608.408,156.45255475999838L609.2859999999998,156.39810667051552L610.1639999999999,156.3443661959007L611.0419999999999,156.29132584981565L611.92,156.23897818255662L612.7979999999999,156.18731578193868L613.676,156.13633127415423L614.554,156.0860173246036L615.4319999999999,156.03636663869975L616.31,155.98737196264523L617.1880000000001,155.93902608418318L618.0659999999998,155.89132183332129L618.9440000000001,155.8442520830291L619.8219999999999,155.79780974990953L620.6999999999999,155.7519877948436L621.578,155.70677922360926L622.4559999999999,155.6621770874746L623.3339999999998,155.61817448376527L624.212,155.57476455640636L625.0899999999999,155.53194049643946L625.9680000000001,155.48969554251465L626.8459999999999,155.4480229813577L627.7239999999999,155.40691614821338L628.602,155.36636842726423L629.48,155.32637325202623L630.358,155.28692410572026L631.236,155.24801452162126L632.1139999999999,155.2096380833843L632.9919999999998,155.17178842534844L633.8699999999999,155.1344592328181L634.748,155.09764424232367L635.6259999999999,155.06133724185983L636.504,155.02553207110378L637.3819999999998,154.9902226216126L638.26,154.9554028370002L639.138,154.92106671309529L640.016,154.88720829807903L640.894,154.85382169260464L641.772,154.82090104989783L642.65,154.7884405758394L643.528,154.75643452902986L644.406,154.72487722083696L645.284,154.69376301542613L646.1619999999999,154.66308632977447L647.0400000000001,154.6328416336683L647.918,154.6030234496857L648.7959999999998,154.57362635316275L649.674,154.54464497214585L650.5519999999998,154.51607398732872L651.4299999999998,154.4879081319758L652.308,154.4601421918316L653.1859999999999,154.4327710050169L654.0639999999999,154.40578946191206L654.9419999999999,154.3791925050275L655.8199999999998,154.35297512886237L656.6980000000001,154.3271323797511L657.5759999999999,154.3016593556987L658.454,154.276551206205L659.3319999999999,154.25180313207835L660.2099999999999,154.22741038523867L661.0879999999999,154.2033682685109L661.966,154.17967213540854L662.8439999999999,154.15631738990828L663.7219999999999,154.13329948621524L664.5999999999999,154.11061392852037L665.478,154.08825627074881L666.3559999999999,154.06622211630085L667.234,154.04450711778514L668.112,154.02310697674477L668.99,154.0020174433761L669.868,153.98123431624126L670.746,153.96075344197416L671.6239999999999,153.9405707149803L672.502,153.92068207713132L673.3799999999999,153.90108351745315L674.258,153.88177107181L675.136,153.8627408225827L676.014,153.84398889834276L676.8919999999998,153.82551147352154L677.77,153.8073047680759L678.6479999999999,153.7893650471495L679.526,153.77168862073046L680.404,153.75427184330582L681.2819999999999,153.7371111135127L682.16,153.72020287378626L683.038,153.70354361000534L683.9159999999998,153.687129851135L684.7940000000001,153.67095816886754L685.6719999999999,153.6550251772603L686.55,153.63932753237268L687.428,153.6238619319005L688.3059999999998,153.6086251148095L689.1839999999999,153.59361386096677L690.0619999999998,153.57882499077175L690.9399999999999,153.56425536478562L691.8179999999999,153.54990188336004L692.696,153.5357614862654L693.574,153.52183115231804L694.452,153.50810789900768L695.33,153.494588782124L696.208,153.4812708953837L697.0859999999999,153.46815137005729L697.964,153.45522737459586L698.842,153.44249611425877L699.7199999999999,153.42995483074097L700.598,153.41760080180163L701.476,153.40543134089287L702.3539999999998,153.39344379678954L703.2319999999999,153.38163555321972L704.1099999999999,153.37000402849665L704.988,153.3585466751508L705.866,153.34726097956414L706.7439999999999,153.3361444616052L707.6219999999998,153.32519467426528L708.5,153.3144092032967L709.378,153.30378566685198L710.2559999999999,153.29332171512496L711.1339999999999,153.2830150299935L712.012,153.272863324664L712.89,153.2628643433175L713.7679999999999,153.25301586075798L714.6459999999998,153.24331568206262L715.524,153.23376164223336L716.4019999999999,153.2243516058517L717.2799999999999,153.21508346673454L718.1579999999999,153.2059551475927L719.036,153.1969645996917L719.914,153.1881098025146L720.792,153.17938876342697L721.67,153.17079951734476L722.548,153.162340126404L723.426,153.15400867963317L724.304,153.14580329262805L725.1819999999999,153.13772210722883L726.0600000000001,153.12976329119994L726.9380000000001,153.12192503791232L727.8159999999998,153.1142055660283L728.694,153.1066031191889L729.5719999999999,153.0991159657041L730.4499999999998,153.09174239824526L731.3280000000001,153.08448073354052L732.2059999999999,153.07732931207264L733.084,153.07028649777993L733.962,153.06335067775908L734.8399999999998,153.05652026197163L735.718,153.04979368295236L736.5959999999999,153.0431693955208L737.474,153.03664587649556L738.352,153.03022162441073L739.2299999999999,153.02389515923605L740.108,153.0176650220988L740.986,153.01152977500914L741.864,153.00548800058766L742.7419999999998,152.99953830179626L743.6199999999999,152.9936793016711L744.498,152.98790964305869L745.3759999999999,152.98222798835482L746.2539999999999,152.97663301924578L747.1319999999998,152.97112343645267L748.01,152.9656979594782L748.888,152.9603553263564L749.766,152.95509429340484L750.644,152.94991363497957L751.522,152.94481214323295L752.3999999999999,152.9397886278738L753.278,152.93484191593052L754.156,152.92997085151669L755.0340000000001,152.92517429559925L755.9119999999998,152.9204511257697L756.79,152.91580023601713L757.668,152.91122053650486L758.5459999999998,152.9067109533487L759.4240000000001,152.90227042839842L760.3019999999999,152.8978979190215L761.18,152.89359239788956L762.0580000000001,152.88935285276705L762.9359999999998,152.8851782863028L763.814,152.88106771582372L764.6919999999999,152.87702017313129L765.57,152.87303470430015L766.4479999999999,152.8691103694795L767.3259999999998,152.86524624269663L768.204,152.86144141166292L769.0819999999999,152.85769497758233L769.96,152.85400605496216L770.8379999999999,152.85037377142612L771.7159999999999,152.8467972675298L772.5939999999999,152.84327569657842L773.4719999999998,152.83980822444684L774.3499999999999,152.83639402940184L775.228,152.83303230192666L776.1059999999999,152.82972224454784L776.984,152.8264630716641L777.8619999999999,152.82325400937742L778.74,152.82009429532667L779.618,152.8169831785226L780.4959999999999,152.8139199191859L781.3739999999999,152.81090378858656L782.252,152.8079340688858L783.13,152.80501005297987L784.0079999999999,152.8021310443459L784.8859999999999,152.7992963568899L785.764,152.79650531479658L786.6419999999998,152.79375725238117L787.5200000000001,152.79105151394344L788.3979999999999,152.78838745362336L789.276,152.78576443525887L790.154,152.78318183224542L791.0319999999998,152.78063902739754L791.9099999999999,152.77813541281213L792.788,152.77567038973362L793.6659999999999,152.77324336842108L794.5440000000001,152.77085376801682L795.4219999999998,152.76850101641722L796.3,152.76618455014489L797.178,152.7639038142228L798.056,152.7616582620501L798.9339999999999,152.7594473552796L799.8119999999999,152.75727056369692L800.6899999999999,152.75512736510134L801.568,152.75301724518832L802.4459999999999,152.7509396974335L803.324,152.74889422297852L804.202,152.74688033051837L805.08,152.74489753618988L805.958,152.7429453634626L806.836,152.74102334303038L807.714,152.73913101270495L808.5920000000001,152.7372679173108L809.4699999999999,152.73543360858173L810.348,152.7336276450584L811.226,152.73184959198795L812.1039999999998,152.73009902122456L812.9819999999999,152.72837551113145L813.8599999999999,152.72667864648474L814.7379999999998,152.72500801837788L815.616,152.72336322412812L816.4939999999999,152.72174386718413L817.3719999999998,152.72014955703463L818.25,152.71857990911866L819.1279999999998,152.71703454473715L820.0059999999999,152.71551309096546L820.8839999999999,152.7140151805675L821.762,152.71254045191066L822.6399999999998,152.71108854888266L823.5179999999999,152.70965912080874L824.3959999999998,152.70825182237067L825.2740000000002,152.70686631352677L826.1519999999999,152.70550225943302L827.0299999999999,152.70415933036517L827.9080000000001,152.70283720164238L828.786,152.70153555355154L829.6639999999999,152.70025407127298L830.542,152.6989924448072L831.42,152.6977503689025L832.2979999999999,152.69652754298383L833.176,152.6953236710828L834.054,152.69413846176832L834.9319999999998,152.69297162807857L835.8100000000002,152.69182288745392L836.6879999999999,152.69069196167086L837.5659999999999,152.6895785767767L838.4440000000002,152.68848246302548L839.322,152.68740335481462L840.1999999999998,152.68634099062263L841.0780000000002,152.6852951129478L841.9559999999999,152.68426546824767L842.8339999999998,152.68325180687916L843.712,152.6822538830403L844.5899999999999,152.68127145471206L845.4679999999997,152.68030428360146L846.3460000000002,152.67935213508554L847.2239999999998,152.67841477815577L848.1019999999996,152.67749198536382L848.9800000000001,152.67658353276786L849.858,152.6756891998795L850.736,152.674808769612L851.614,152.67394202822874L852.4919999999998,152.6730887652927L853.3699999999999,152.67224877361699L854.248,152.6714218492152L855.1259999999999,152.67060779125387L856.0039999999999,152.66980640200438L856.8819999999998,152.66901748679626L857.7599999999999,152.66824085397118L858.638,152.6674763148373L859.5160000000001,152.66672368362467L860.394,152.6659827774411L861.272,152.66525341622872L862.1500000000001,152.66453542272134L863.028,152.66382862240224L863.906,152.66313284346268L864.7840000000001,152.6624479167613L865.6619999999998,152.66177367578365L866.54,152.66110995660273L867.418,152.6604565978401L868.2959999999998,152.6598134406273L869.1740000000001,152.6591803285682L870.0520000000001,152.6585571077017L870.93,152.65794362646525L871.8080000000001,152.65733973565858L872.686,152.65674528840833L873.564,152.65616014013295L874.4419999999999,152.65558414850847L875.32,152.6550171734345L876.1979999999999,152.65445907700078L877.0759999999999,152.65390972345452L877.954,152.65336897916805L878.8319999999998,152.65283671260693L879.7099999999998,152.65231279429858L880.5880000000002,152.6517970968017L881.4659999999999,152.65128949467567L882.344,152.65078986445084L883.222,152.65029808459914L884.0999999999999,152.64981403550507L884.978,152.64933759943747L885.856,152.64886866052126L886.7339999999999,152.64840710470997L887.6119999999999,152.6479528197589L888.49,152.64750569519802L889.3679999999998,152.6470656223061L890.2459999999999,152.64663249408463L891.1240000000001,152.64620620523277L892.002,152.64578665212204L892.88,152.64537373277201L893.7580000000002,152.64496734682606L894.6359999999999,152.64456739552753L895.514,152.64417378169665L896.3919999999999,152.64378640970733L897.2699999999999,152.64340518546473L898.1479999999999,152.64303001638302L899.026,152.64266081136356L899.9039999999998,152.64229748077352L900.7819999999998,152.64193993642488L901.6600000000001,152.64158809155356L902.5379999999998,152.64124186079928L903.4159999999999,152.64090116018545L904.2940000000001,152.64056590709964L905.1719999999998,152.6402360202744L906.05,152.63991141976803L906.928,152.63959202694653L907.8059999999998,152.6392777644649L908.6839999999999,152.63896855624952L909.5619999999999,152.63866432748054L910.4399999999998,152.6383650045747L911.318,152.6380705151684L912.196,152.63778078810122L913.0739999999998,152.63749575339975L913.952,152.63721534226153L914.83,152.63693948703963L915.708,152.6366681212274L916.586,152.63640117944354L917.464,152.6361385974175L918.3419999999999,152.6358803119751L919.2199999999999,152.63562626102475L920.0980000000001,152.63537638354373L920.9759999999998,152.6351306195648L921.8539999999999,152.63488891016323L922.7319999999999,152.63465119744427L923.6099999999997,152.63441742453045L924.4879999999998,152.63418753554978L925.3660000000001,152.633961475624L926.2439999999999,152.63373919085697L927.1219999999998,152.63352062832382L928,152.6333057360599L928.8779999999999,152.63309446305058'
    );
  });
};
