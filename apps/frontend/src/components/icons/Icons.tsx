import { GoHome as Home } from "react-icons/go";
import { IoSettingsOutline as Settings } from "react-icons/io5";
import { IoCloseCircleOutline as Close } from "react-icons/io5";
import { CiMenuFries as Burgher } from "react-icons/ci";
import { LuComponent as Components } from "react-icons/lu";
import { BsArrowLeftCircle as ArrowLeft } from "react-icons/bs";
import { FaRegStar as Star } from "react-icons/fa";
import { GoArrowUpRight as ExternalLink } from "react-icons/go";
import { IoMdAdd as Plus } from "react-icons/io";
import { FiPaperclip as Clip } from "react-icons/fi";
import { IoMdRemove as Remove } from "react-icons/io";
import { FaRegCalendar as Calendar } from "react-icons/fa";
import { IoMenu as Menu } from "react-icons/io5";
import { IoIosCloseCircle as CloseLocation } from "react-icons/io";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Icons: Record<string, any> = {
  Home,
  Settings,
  Close,
  Burgher,
  Components,
  ArrowLeft,
  Star,
  ExternalLink,
  Plus,
  Clip,
  Remove,
  Calendar,
  Menu,
  CloseLocation,
  Checked: () => (
    <svg
      className="w-4 h-4 text-gray-900"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path d="M5 13l4 4L19 7"></path>
    </svg>
  ),
  LocationError: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="195"
      height="196"
      viewBox="0 0 195 196"
      fill="none"
    >
      <path
        d="M195 97.6235C195 151.471 151.348 195.124 97.5 195.124C43.6522 195.124 0 151.471 0 97.6235C0 43.7758 43.6522 0.123535 97.5 0.123535C151.348 0.123535 195 43.7758 195 97.6235Z"
        fill="#FFF0F4"
      />
    </svg>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  NarrowCast: ({ size = 18, ...props }: any) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 19 18"
      fill="none"
      {...props}
    >
      <g clipPath="url(#clip0_5104_8324)">
        <path
          d="M15.5319 15.5894C16.6507 14.4706 17.4126 13.0451 17.7213 11.4933C18.03 9.94146 17.8715 8.33293 17.266 6.87113C16.6605 5.40932 15.6351 4.1599 14.3196 3.28085C13.004 2.40181 11.4572 1.93262 9.875 1.93262C8.29276 1.93262 6.74604 2.40181 5.43045 3.28085C4.11486 4.1599 3.08948 5.40932 2.48398 6.87113C1.87847 8.33293 1.72004 9.94146 2.02871 11.4933C2.33739 13.0451 3.0993 14.4706 4.21811 15.5894"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.0181 13.076C13.6396 12.4544 14.0627 11.6624 14.2341 10.8003C14.4055 9.93823 14.3174 9.04466 13.981 8.23262C13.6446 7.42057 13.0749 6.72651 12.3441 6.2382C11.6132 5.74989 10.754 5.48926 9.875 5.48926C8.99603 5.48926 8.13678 5.74989 7.40592 6.2382C6.67506 6.72651 6.10541 7.42057 5.76898 8.23262C5.43256 9.04466 5.34448 9.93823 5.51587 10.8003C5.68727 11.6624 6.11044 12.4544 6.73189 13.076"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.98611 9.93283C8.98611 10.1686 9.07977 10.3947 9.24646 10.5614C9.41316 10.7281 9.63926 10.8217 9.875 10.8217C10.1108 10.8217 10.3368 10.7281 10.5035 10.5614C10.6702 10.3947 10.7639 10.1686 10.7639 9.93283C10.7639 9.69709 10.6702 9.47099 10.5035 9.30429C10.3368 9.1376 10.1108 9.04395 9.875 9.04395C9.63926 9.04395 9.41316 9.1376 9.24646 9.30429C9.07977 9.47099 8.98611 9.69709 8.98611 9.93283Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  XClose: ({ size = 18, ...props }: any) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="x-close">
        <path
          id="Icon"
          d="M18 6L6 18M6 6L18 18"
          stroke="black"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
    </svg>
  ),
  Cursive: ({ size = 30 }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="98"
      height={size}
      viewBox="0 0 98 30"
      fill="none"
    >
      <path
        d="M40.771 28.7788H43.4257L43.4324 22.9275C43.4418 17.2422 45.8944 14.7829 47.6727 14.7829C49.8309 14.7829 50.2658 15.8038 50.6458 15.8038C51.0834 15.8038 51.4045 15.0451 51.4058 14.55C51.4072 13.6174 50.33 12.6835 48.9599 12.6554H48.7551C48.4046 12.6554 48.0554 12.7142 47.6767 12.8307C46.1018 13.3552 44.6808 14.4149 43.4404 17.3091L43.4739 12.7437H40.7884L40.771 28.7815V28.7788Z"
        fill="#848484"
      />
      <path
        d="M51.47 23.444C51.7858 23.333 52.1351 23.4815 52.2689 23.7892C53.4958 26.6272 55.3597 27.79 57.8311 27.79C60.3025 27.79 61.2057 26.5576 61.2083 25.3333C61.1521 23.9351 59.699 23.0908 58.2151 22.3615C58.2111 22.3602 58.2084 22.3575 58.2044 22.3562L54.7135 20.9004C53.053 20.2006 51.83 18.5963 51.8032 17.0227C51.8059 15.5362 53.0061 12.5617 56.5921 12.4453H56.9426C59.7084 12.4453 61.5335 13.6576 62.8488 15.5803C63.0401 15.86 62.9853 16.2413 62.719 16.4514C62.4286 16.6802 62.0085 16.6133 61.7957 16.3109C60.6263 14.6437 59.1973 13.9559 58.2058 13.7432C57.5488 13.6027 56.8637 13.6188 56.2295 13.8395C54.9436 14.2878 54.1675 14.9983 54.1662 16.0915C54.193 17.4616 55.1537 18.3956 56.8436 19.0659L59.7873 20.2608C61.4197 20.9017 63.4576 22.4191 63.4843 24.4596C63.4817 26.646 61.9911 28.8337 57.791 28.9795H57.5287C54.3669 28.9795 52.1337 27.0005 50.9924 24.3418C50.8452 24.0006 51.0164 23.6046 51.3684 23.4815L51.4714 23.4454L51.47 23.444Z"
        fill="#848484"
      />
      <path
        d="M67.3941 13.8382V16.7003C67.3941 17.281 67.3928 17.8617 67.3914 18.4424C67.3914 19.09 67.3901 19.739 67.3888 20.3866C67.3888 21.0583 67.3874 21.7286 67.3861 22.4003C67.3861 23.0493 67.3848 23.6982 67.3834 24.3472C67.3834 24.9293 67.3821 25.5126 67.3807 26.0947C67.3807 26.5657 67.3807 27.038 67.3794 27.509C67.3794 27.8248 67.3794 28.1406 67.3794 28.4563C67.3794 28.5714 67.3794 28.6865 67.3794 28.8016H64.7247L64.7475 12.7637H67.3968V13.8355L67.3941 13.8382Z"
        fill="#848484"
      />
      <path
        d="M68.2143 12.7664L69.6768 16.6468C69.8668 17.1766 70.0568 17.7051 70.2468 18.235C70.4515 18.805 70.6563 19.375 70.861 19.945C71.063 20.5097 71.2664 21.073 71.4685 21.6377C71.6518 22.1488 71.8351 22.6599 72.0184 23.1711C72.1656 23.5818 72.3141 23.994 72.4613 24.4047C72.5563 24.6697 72.6513 24.9333 72.7463 25.1982C72.773 25.2731 72.7998 25.3481 72.8266 25.4216C73.8422 28.2797 74.4831 28.8912 75.6793 28.8912C76.8755 28.8912 77.7265 28.1914 78.6939 25.3922L82.6719 13.7526C82.8378 13.2695 82.4779 12.7664 81.9668 12.7664C81.6483 12.7664 81.3646 12.9685 81.2616 13.2709L77.119 25.3922C76.8554 26.2084 76.8019 26.4814 76.3992 26.5001C75.8452 26.5269 75.6713 26.1509 75.409 25.4216L70.9292 12.7664H68.213H68.2143Z"
        fill="#848484"
      />
      <path
        d="M90.0726 12.4159C92.4637 12.4159 95.7272 13.9613 95.7232 16.7311C95.7219 17.752 95.0207 18.9883 92.3379 18.9883L91.1712 18.9589C88.6035 18.9589 87.5437 20.2836 86.9095 21.8049C85.9354 24.1438 86.8627 26.5603 89.2885 27.2882C89.5802 27.3752 89.8933 27.4408 90.2279 27.4755C93.2933 27.7953 95.1853 25.2424 96.3186 23.1269C96.4899 22.8084 96.886 22.688 97.2057 22.8566C97.5162 23.0199 97.6486 23.4012 97.4974 23.717C96.134 26.5657 93.5917 28.9755 89.9014 28.9755C85.6156 28.9755 82.2692 24.5439 82.2745 20.5485C82.2812 16.2908 85.6116 12.4132 90.0726 12.4132V12.4159ZM84.9881 19.7055C84.9854 21.0757 85.1326 21.3874 85.4805 22.5823C85.3667 20.9432 87.149 17.5834 91.5806 17.5834C92.2804 17.5834 92.8665 17.2087 92.9708 16.6882C93.3468 14.8083 92.0289 13.4047 89.5829 13.5291C86.1602 13.7031 84.9934 16.9933 84.9894 19.7042L84.9881 19.7055Z"
        fill="#848484"
      />
      <path
        d="M39.6738 28.7735H37.0192L37.0259 21.0569C36.2926 24.002 33.6018 28.9768 30.2192 28.9768C26.5449 28.9768 26.3456 25.7695 26.3536 21.1627L26.367 12.7356H29.0203L29.007 21.1627C29.0016 24.8664 29.0846 26.4961 31.2428 26.4961C34.2173 26.4961 36.8532 19.3362 37.0325 16.8582L37.0366 12.7356H39.722L39.6738 28.7735Z"
        fill="#848484"
      />
      <path
        d="M66.0842 10.4235C66.8793 10.4235 67.5239 9.77892 67.5239 8.98377C67.5239 8.18863 66.8793 7.54404 66.0842 7.54404C65.289 7.54404 64.6444 8.18863 64.6444 8.98377C64.6444 9.77892 65.289 10.4235 66.0842 10.4235Z"
        fill="#848484"
      />
      <path
        d="M24.4643 21.2322C24.1338 21.0757 23.7391 21.2135 23.5397 21.5199C21.0349 25.4016 17.7754 28.3359 13.3679 27.0969C9.2922 25.9502 6.78872 22.4472 6.07019 18.3942C6.07019 18.3942 4.38024 7.64305 11.8666 4.3809C12.5972 4.85457 13.863 6.26754 14.5668 7.44234C15.1395 8.39637 15.5663 9.42399 15.9436 10.469C16.0707 10.8236 16.1925 11.1795 16.3129 11.5354C16.5324 12.1897 16.7491 12.8521 17.0917 13.4515C18.312 15.5857 21.2061 15.8038 22.9817 14.2222C23.327 13.9145 23.624 13.5412 23.8488 13.1023C25.5668 9.75449 23.9639 5.90895 20.3806 3.90991C18.9636 3.09771 17.3486 2.64144 15.7269 2.50095C14.4075 2.38721 13.1297 2.48087 11.9188 2.75651C11.1467 2.15573 10.6664 1.8172 10.6664 1.8172C7.20351 -0.605995 4.38024 0.0938027 4.38024 0.0938027C4.00425 0.175423 3.63762 0.3012 3.28705 0.459089C2.99536 0.591555 2.71303 0.746768 2.44409 0.920714C1.38034 1.60579 0.275116 2.82475 0.0610291 4.08385C0.00215509 4.42907 -0.0754515 5.2252 0.160044 6.25148C0.501246 7.73805 2.43204 8.1408 3.34727 6.91917C3.78882 6.32909 3.82896 5.52493 3.43825 4.90006C3.35663 4.76893 3.28304 4.64449 3.22417 4.53611C2.86022 3.86709 2.78261 2.92778 3.23086 2.27883C3.46903 1.93495 3.83699 1.69544 4.22636 1.54424C5.53765 1.03311 7.11654 1.46128 8.32747 2.05002C8.62585 2.19587 8.92022 2.35376 9.2079 2.52102C9.2079 2.52102 9.49692 2.66686 10.3345 3.23687C5.88152 4.92414 2.63543 9.18715 2.17648 14.4925C1.58774 21.2978 5.9966 28.5701 12.937 29.1709C18.0484 29.6137 22.2458 26.6353 24.7814 22.2358C24.9861 21.8785 24.847 21.4155 24.4643 21.2336V21.2322ZM21.0964 7.28445C21.4162 8.04446 21.554 8.87138 21.5928 9.69561C21.6316 10.5279 21.5581 11.4003 21.2061 12.1656C20.8542 12.927 20.0902 13.6281 19.1857 13.3043C18.7308 13.1411 18.3775 12.7678 18.1367 12.349C17.8958 11.9301 17.754 11.4632 17.6055 11.0042C16.725 8.292 15.4526 5.76176 13.2809 3.85906C16.04 3.14588 19.947 4.54815 21.0978 7.28579L21.0964 7.28445Z"
        fill="#848484"
      />
    </svg>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  People: ({ size = 18, ...props }: any) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 19 18"
      fill="none"
      {...props}
    >
      <g clipPath="url(#clip0_4785_776)">
        <path
          d="M3.12495 6.00012C3.12509 5.28905 3.30905 4.5901 3.65896 3.97109C4.00887 3.35208 4.51285 2.83403 5.122 2.46722C5.73115 2.1004 6.42477 1.89728 7.13556 1.87756C7.84635 1.85785 8.55017 2.0222 9.17872 2.35468C9.80726 2.68716 10.3392 3.17647 10.7229 3.77513C11.1066 4.3738 11.329 5.06147 11.3686 5.77144C11.4081 6.4814 11.2635 7.18954 10.9487 7.82712C10.6339 8.46471 10.1597 9.0101 9.57195 9.41037C10.8376 9.87457 11.9353 10.7069 12.7239 11.8002C13.5125 12.8936 13.9559 14.1979 13.9969 15.5454C13.9952 15.6906 13.9374 15.8296 13.8356 15.9333C13.7338 16.0369 13.5958 16.0972 13.4506 16.1016C13.3054 16.106 13.1641 16.054 13.0563 15.9567C12.9484 15.8593 12.8824 15.724 12.8719 15.5791C12.8273 14.1177 12.2154 12.7311 11.1658 11.7132C10.1163 10.6952 8.71166 10.1259 7.24957 10.1259C5.78748 10.1259 4.38284 10.6952 3.33332 11.7132C2.28379 12.7311 1.67186 14.1177 1.6272 15.5791C1.61969 15.726 1.55495 15.8641 1.44687 15.9638C1.33878 16.0635 1.19593 16.117 1.04893 16.1127C0.901922 16.1083 0.762455 16.0466 0.660402 15.9407C0.558349 15.8348 0.501827 15.6932 0.502946 15.5461C0.543859 14.1985 0.987151 12.894 1.77576 11.8006C2.56437 10.7071 3.6622 9.87462 4.92795 9.41037C4.37207 9.03209 3.91717 8.52358 3.6029 7.92917C3.28863 7.33476 3.12455 6.67249 3.12495 6.00012ZM7.24995 3.00012C6.4543 3.00012 5.69123 3.31619 5.12863 3.8788C4.56602 4.44141 4.24995 5.20447 4.24995 6.00012C4.24995 6.79577 4.56602 7.55883 5.12863 8.12144C5.69123 8.68405 6.4543 9.00012 7.24995 9.00012C8.0456 9.00012 8.80866 8.68405 9.37127 8.12144C9.93388 7.55883 10.2499 6.79577 10.2499 6.00012C10.2499 5.20447 9.93388 4.44141 9.37127 3.8788C8.80866 3.31619 8.0456 3.00012 7.24995 3.00012ZM13.4674 6.00012C13.3564 6.00012 13.2484 6.00762 13.1419 6.02262C13.0676 6.03593 12.9913 6.03413 12.9177 6.01733C12.844 6.00052 12.7745 5.96906 12.7133 5.92481C12.6521 5.88056 12.6004 5.82443 12.5613 5.75977C12.5223 5.69511 12.4966 5.62325 12.486 5.54847C12.4753 5.47369 12.4798 5.39753 12.4992 5.32452C12.5185 5.25151 12.5524 5.18316 12.5988 5.12354C12.6452 5.06391 12.7031 5.01425 12.7691 4.97749C12.8351 4.94074 12.9078 4.91765 12.9829 4.90962C13.7289 4.80177 14.4895 4.94501 15.1451 5.31681C15.8007 5.6886 16.3141 6.26784 16.6044 6.96336C16.8947 7.65888 16.9456 8.4312 16.7489 9.15877C16.5522 9.88634 16.1192 10.5279 15.5179 10.9824C16.4017 11.3781 17.1521 12.0211 17.6786 12.8338C18.2051 13.6466 18.4851 14.5943 18.4849 15.5626C18.4849 15.7118 18.4257 15.8549 18.3202 15.9604C18.2147 16.0659 18.0716 16.1251 17.9224 16.1251C17.7733 16.1251 17.6302 16.0659 17.5247 15.9604C17.4192 15.8549 17.3599 15.7118 17.3599 15.5626C17.3599 14.7257 17.0902 13.9111 16.5909 13.2395C16.0916 12.5678 15.3893 12.0749 14.5879 11.8336L14.1874 11.7136V10.4566L14.4949 10.2999C14.9508 10.069 15.3155 9.69121 15.5302 9.22755C15.7449 8.76389 15.7971 8.2414 15.6783 7.74444C15.5596 7.24747 15.2768 6.80503 14.8756 6.48854C14.4745 6.17205 13.9784 5.99998 13.4674 6.00012Z"
          fill="currentColor"
        />
      </g>
    </svg>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Activity: ({ size = 18, ...props }: any) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 19 18"
      fill="none"
      {...props}
    >
      <path
        d="M9.50019 0.75C12.2609 0.75 14.7502 2.67375 14.7502 5.25V8.65425C14.7502 9.13575 14.8919 9.606 15.1589 10.0065L16.8089 12.48C16.9235 12.6514 16.9894 12.8507 16.9994 13.0566C17.0095 13.2625 16.9634 13.4673 16.8662 13.6491C16.7689 13.8309 16.6241 13.9828 16.4471 14.0886C16.2702 14.1945 16.0679 14.2502 15.8617 14.25H12.1252C12.1252 14.5947 12.0573 14.9361 11.9254 15.2545C11.7935 15.573 11.6001 15.8624 11.3563 16.1062C11.1126 16.3499 10.8232 16.5433 10.5047 16.6752C10.1863 16.8071 9.84491 16.875 9.50019 16.875C9.15547 16.875 8.81413 16.8071 8.49565 16.6752C8.17717 16.5433 7.88779 16.3499 7.64404 16.1062C7.40029 15.8624 7.20693 15.573 7.07501 15.2545C6.94309 14.9361 6.87519 14.5947 6.87519 14.25H3.13944C2.93338 14.2502 2.73112 14.1944 2.55426 14.0887C2.37739 13.9829 2.23254 13.8311 2.13516 13.6495C2.03777 13.4679 1.9915 13.2633 2.00128 13.0575C2.01106 12.8516 2.07653 12.6523 2.19069 12.4808L3.84069 10.0065C4.1077 9.60606 4.25019 9.13554 4.25019 8.65425V5.25C4.25019 2.67375 6.73869 0.75 9.50019 0.75ZM5.37519 5.25V8.65425C5.37539 9.35756 5.1674 10.0452 4.77744 10.6305L3.12744 13.104L3.12519 13.1115L3.12594 13.1168L3.12894 13.1213L3.13344 13.1243L3.13869 13.125H15.8617L15.8669 13.1243L15.8714 13.1213L15.8744 13.1168L15.8752 13.1122C15.8752 13.1096 15.8745 13.107 15.8729 13.1047L14.2237 10.6305C13.8336 10.0452 13.6254 9.35762 13.6252 8.65425V5.25C13.6252 3.477 11.8379 1.875 9.50019 1.875C7.16244 1.875 5.37519 3.477 5.37519 5.25ZM11.0002 14.25H8.00019C8.00019 14.6478 8.15823 15.0294 8.43953 15.3107C8.72084 15.592 9.10237 15.75 9.50019 15.75C9.89802 15.75 10.2795 15.592 10.5609 15.3107C10.8422 15.0294 11.0002 14.6478 11.0002 14.25Z"
        fill="currentColor"
      />
    </svg>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Profile: ({ size = 18, ...props }: any) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 19 18"
      fill="none"
      {...props}
    >
      <g clipPath="url(#clip0_4785_786)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18.5 9C18.5 13.9706 14.4706 18 9.5 18C4.52944 18 0.5 13.9706 0.5 9C0.5 4.02944 4.52944 0 9.5 0C14.4706 0 18.5 4.02944 18.5 9ZM14.4814 15.1961C13.1185 16.2933 11.3859 16.95 9.5 16.95C7.6132 16.95 5.87993 16.2927 4.51665 15.1946C4.50802 15.0851 4.50064 14.9683 4.50064 14.8511C4.54035 13.5515 5.08452 12.3185 6.01781 11.4133C6.95111 10.5081 8.20019 10.0018 9.50036 10.0018C10.8005 10.0018 12.0496 10.5081 12.9829 11.4133C13.8805 12.2838 14.4071 13.9165 14.4814 15.1961ZM15.4569 14.2649C15.3331 13.2664 14.96 12.3118 14.368 11.491C13.6667 10.5186 12.6904 9.77833 11.5649 9.36549C12.2134 8.92419 12.7033 8.28664 12.9628 7.54642C13.2223 6.8062 13.2377 6.00229 13.0067 5.25268C12.7757 4.50307 12.3105 3.84725 11.6793 3.38148C11.0482 2.9157 10.2844 2.66449 9.50003 2.66473C8.71564 2.66449 7.95183 2.9157 7.3207 3.38148C6.68958 3.84725 6.22438 4.50307 5.99339 5.25268C5.7624 6.00229 5.77778 6.8062 6.03727 7.54642C6.29676 8.28664 6.7867 8.92419 7.43518 9.36549C6.30971 9.77828 5.33353 10.5184 4.63227 11.4907C4.04015 12.3116 3.66691 13.2663 3.54309 14.2649C2.30281 12.8627 1.55 11.0192 1.55 9C1.55 4.60934 5.10934 1.05 9.5 1.05C13.8907 1.05 17.45 4.60934 17.45 9C17.45 11.0192 16.6972 12.8626 15.4569 14.2649ZM7.61363 8.2193C7.11333 7.719 6.83226 7.04044 6.83226 6.33291C6.83226 5.62537 7.11333 4.94682 7.61363 4.44652C8.11394 3.94621 8.79249 3.66515 9.50003 3.66515C10.2076 3.66515 10.8861 3.94621 11.3864 4.44652C11.8867 4.94682 12.1678 5.62537 12.1678 6.33291C12.1678 7.04044 11.8867 7.719 11.3864 8.2193C10.8861 8.71961 10.2076 9.00067 9.50003 9.00067C8.79249 9.00067 8.11394 8.71961 7.61363 8.2193Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_4785_786">
          <rect
            width="18"
            height="18"
            fill="white"
            transform="translate(0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Spinner: ({ iconSize }: any) => (
    <svg
      aria-hidden="true"
      className={`${iconSize} inline mr-2 text-gray-200 animate-spin dark:text-tertiary fill-white`}
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Cards: ({ ...props }: any) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.4 8H4V11.6C4 11.8209 4.17909 12 4.4 12H11.6C11.8209 12 12 11.8209 12 11.6V4.4C12 4.17909 11.8209 4 11.6 4H8V0.4C8 0.179086 7.82091 0 7.6 0H0.4C0.179086 0 0 0.179086 0 0.4V7.6C0 7.82091 0.179086 8 0.4 8ZM1.33333 1.33333V6.66667H4V4.4C4 4.37239 4.0028 4.34543 4.00813 4.31939C4.04542 4.13711 4.2067 4 4.4 4H6.66667V1.33333H1.33333ZM8 5.33333V7.6C8 7.62761 7.9972 7.65457 7.99187 7.68061C7.95458 7.86289 7.7933 8 7.6 8H5.33333V10.6667H10.6667V5.33333H8Z"
        fill="currentColor"
      />
    </svg>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Pencil: ({ ...props }: any) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14.2008 1.79917L14.5543 1.44562V1.44562L14.2008 1.79917ZM3.875 14.7766V15.2766C4.00761 15.2766 4.13479 15.2239 4.22855 15.1302L3.875 14.7766ZM1.25 14.7766H0.75C0.75 15.0528 0.973858 15.2766 1.25 15.2766V14.7766ZM1.25 12.0983L0.896447 11.7448C0.802678 11.8385 0.75 11.9657 0.75 12.0983H1.25ZM11.9027 2.15273C12.4397 1.61576 13.3103 1.61576 13.8472 2.15273L14.5543 1.44562C13.6268 0.518126 12.1231 0.518126 11.1956 1.44562L11.9027 2.15273ZM13.8472 2.15273C14.3842 2.6897 14.3842 3.5603 13.8472 4.09727L14.5543 4.80438C15.4818 3.87688 15.4818 2.37312 14.5543 1.44562L13.8472 2.15273ZM13.8472 4.09727L3.52145 14.4231L4.22855 15.1302L14.5543 4.80438L13.8472 4.09727ZM3.875 14.2766H1.25V15.2766H3.875V14.2766ZM11.1956 1.44562L0.896447 11.7448L1.60355 12.4519L11.9027 2.15273L11.1956 1.44562ZM0.75 12.0983V14.7766H1.75V12.0983H0.75ZM10.0706 3.27773L12.7222 5.92938L13.4293 5.22227L10.7777 2.57062L10.0706 3.27773Z"
        fill="currentColor"
      />
    </svg>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SocialLayer: ({ size = 16, ...props }: any) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 260 260"
      fill="none"
      {...props}
    >
      <rect width="260" height="260" fill="none" />
      <path
        d="M200.041 90.543V188.281H41.2172V90.543H200.041ZM200.041 78.3258H41.2172C34.4977 78.3258 29 83.8236 29 90.543V188.281C29 195 34.4977 200.498 41.2172 200.498H200.041C206.76 200.498 212.258 195 212.258 188.281V90.543C212.258 83.7625 206.822 78.3258 200.041 78.3258Z"
        fill="#272928"
      />
      <path
        d="M59.5431 176.063C56.1833 176.063 53.4344 173.315 53.4344 169.955V72.2172C53.4344 68.8574 56.1833 66.1086 59.5431 66.1086H218.367C221.727 66.1086 224.475 68.8574 224.475 72.2172V169.955C224.475 173.315 221.727 176.063 218.367 176.063H59.5431Z"
        fill="#9EFEDD"
      />
      <path
        d="M218.367 72.2173V169.955H59.543V72.2173H218.367ZM218.367 60.0001H59.543C52.8236 60.0001 47.3258 65.4978 47.3258 72.2173V169.955C47.3258 176.674 52.8236 182.172 59.543 182.172H218.367C225.086 182.172 230.584 176.674 230.584 169.955V72.2173C230.584 65.4367 225.147 60.0001 218.367 60.0001Z"
        fill="#272928"
      />
      <path
        d="M114.52 139.412H96.1946C91.1245 139.412 87.0317 135.319 87.0317 130.249C87.0317 125.179 91.1245 121.086 96.1946 121.086H114.52C119.591 121.086 123.683 125.179 123.683 130.249C123.683 135.319 119.591 139.412 114.52 139.412Z"
        fill="#6CD7B2"
      />
      <path
        d="M206.15 139.412H187.824C182.754 139.412 178.661 135.319 178.661 130.249C178.661 125.179 182.754 121.086 187.824 121.086H206.15C211.22 121.086 215.313 125.179 215.313 130.249C215.313 135.319 211.22 139.412 206.15 139.412Z"
        fill="#6CD7B2"
      />
      <path
        d="M114.52 133.303C112.81 133.303 111.466 131.959 111.466 130.249V99.7059C111.466 97.9955 112.81 96.6516 114.52 96.6516C116.231 96.6516 117.575 97.9955 117.575 99.7059V130.249C117.575 131.898 116.231 133.303 114.52 133.303Z"
        fill="#FF7BAC"
      />
      <path
        d="M114.521 90.543C109.45 90.543 105.358 94.6358 105.358 99.7059V130.249C105.358 135.319 109.45 139.412 114.521 139.412C119.591 139.412 123.683 135.319 123.683 130.249V99.7059C123.683 94.6358 119.591 90.543 114.521 90.543Z"
        fill="#272928"
      />
      <path
        d="M187.824 133.303C186.113 133.303 184.77 131.959 184.77 130.249V99.7059C184.77 97.9955 186.113 96.6516 187.824 96.6516C189.534 96.6516 190.878 97.9955 190.878 99.7059V130.249C190.878 131.898 189.534 133.303 187.824 133.303Z"
        fill="#FF7BAC"
      />
      <path
        d="M187.824 90.543C182.754 90.543 178.661 94.6358 178.661 99.7059V130.249C178.661 135.319 182.754 139.412 187.824 139.412C192.894 139.412 196.987 135.319 196.987 130.249V99.7059C196.987 94.6358 192.894 90.543 187.824 90.543Z"
        fill="#272928"
      />
    </svg>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Strava: ({ size = 16, ...props }: any) => (
    <svg
      width="11"
      height={size}
      viewBox="0 0 11 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0 9.28L4.48 0L8.96 9.28H6.08L4.48 5.44L2.88 9.28H0Z"
        fill="white"
      />
      <path
        d="M6.4 9.28L7.68 12.16L8.96 9.28H10.88L7.68 16L4.48 9.28H6.4Z"
        fill="white"
        fill-opacity="0.5"
      />
    </svg>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  GitHub: ({ size = 16, ...props }: any) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_5258_1761)">
        <path
          d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C12.1382 15.054 13.5183 14.0333 14.496 12.6718C15.4737 11.3102 15.9997 9.67624 16 8C16 3.58 12.42 0 8 0Z"
          fill="#090909"
        />
      </g>
      <defs>
        <clipPath id="clip0_5258_1761">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Mona: ({ size = 16, ...props }: any) => (
    <svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      preserveAspectRatio="xMidYMid meet"
      {...props}
    >
      <g
        transform="translate(0.000000,64.000000) scale(0.100000,-0.100000)"
        fill="#000000"
        stroke="none"
      >
        <path
          d="M0 325 l0 -275 75 0 75 0 2 177 c3 201 4 201 55 -37 l29 -135 65 -3
c45 -2 69 1 76 10 6 7 15 42 22 78 23 126 56 260 64 260 5 0 7 -78 6 -172 l-2
-173 87 -3 86 -3 0 276 0 275 -135 0 c-74 0 -135 -3 -135 -7 -1 -24 -40 -246
-44 -250 -3 -3 -7 5 -10 18 -7 34 -26 169 -29 204 l-2 30 -142 3 -143 3 0
-276z"
        />
      </g>
    </svg>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Refresh: ({ size = 16, ...props }: any) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13.6354 8.59536C13.4502 10.3353 12.4643 11.9658 10.833 12.9076C8.12269 14.4724 4.65701 13.5438 3.0922 10.8335L2.92554 10.5448M2.36417 7.40467C2.54937 5.66474 3.53523 4.03426 5.16655 3.09241C7.87688 1.5276 11.3426 2.45623 12.9074 5.16655L13.074 5.45523M2.32886 12.044L2.81689 10.2227L4.63826 10.7107M11.3617 5.28934L13.183 5.77737L13.6711 3.95601"
        stroke="#191A1E"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};